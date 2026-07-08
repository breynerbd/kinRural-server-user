// src/exchange/exchange.controller.js
import axios from "axios";

// Caché simple en memoria (evita golpear la API externa en cada request)
let cache = {
  data: null,
  timestamp: 0,
};
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora

const fetchRatesFromApi = async () => {
  const response = await axios.get(
    `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/latest/GTQ`,
  );
  return response.data.conversion_rates;
};

export const getCurrencies = async (req, res) => {
  try {
    const now = Date.now();

    if (!cache.data || now - cache.timestamp > CACHE_TTL_MS) {
      cache.data = await fetchRatesFromApi();
      cache.timestamp = now;
    }

    const relevantes = ["USD", "EUR", "MXN", "GTQ"];
    const monedas = relevantes.map((code) => ({
      code,
      rate: cache.data[code] ?? null,
    }));

    return res.json({
      success: true,
      base: "GTQ",
      monedas,
      cached: now - cache.timestamp < 1000 ? false : true,
    });
  } catch (error) {
    console.error("❌ getCurrencies:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al obtener monedas.",
    });
  }
};

export const convertCurrency = async (req, res) => {
  try {
    const { monto, moneda_origen, moneda_destino } = req.query;
    if (!monto || !moneda_origen || !moneda_destino) {
      return res.status(400).json({
        success: false,
        message: "monto, moneda_origen y moneda_destino son requeridos.",
      });
    }

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/pair/${moneda_origen}/${moneda_destino}/${monto}`,
    );
    const { conversion_result, conversion_rate } = response.data;

    return res.json({
      success: true,
      monto_original: Number(monto),
      moneda_origen: moneda_origen.toUpperCase(),
      moneda_destino: moneda_destino.toUpperCase(),
      tasa_cambio: conversion_rate,
      monto_convertido: conversion_result,
    });
  } catch (error) {
    console.error("❌ convertCurrency:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al obtener tipo de cambio.",
    });
  }
};

// Endpoint especial: saldo de una cuenta ya convertido
// Reutiliza la caché de tasas, así que no cuesta un request extra a la API externa
export const getAccountBalanceConverted = async (req, res) => {
  try {
    const { saldo, moneda_destino = "USD" } = req.query;
    if (!saldo) {
      return res.status(400).json({
        success: false,
        message: "saldo es requerido.",
      });
    }

    const now = Date.now();
    if (!cache.data || now - cache.timestamp > CACHE_TTL_MS) {
      cache.data = await fetchRatesFromApi();
      cache.timestamp = now;
    }

    const rate = cache.data[moneda_destino.toUpperCase()];
    if (!rate) {
      return res.status(400).json({
        success: false,
        message: "Moneda destino no soportada.",
      });
    }

    return res.json({
      success: true,
      saldo_original: Number(saldo),
      moneda_origen: "GTQ",
      moneda_destino: moneda_destino.toUpperCase(),
      tasa_cambio: rate,
      saldo_convertido: Number(saldo) * rate,
    });
  } catch (error) {
    console.error("❌ getAccountBalanceConverted:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error al convertir saldo.",
    });
  }
};
