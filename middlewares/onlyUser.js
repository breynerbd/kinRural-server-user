export const onlyUser = (req, res, next) => {
    req.user = { id: 2 };
    next();
};
