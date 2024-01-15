/* eslint-disable react/prop-types */
const RouterGuard = ({children, isAuthorizationRequired = true}) => {
    const isAuthorized = true;

    if ((isAuthorizationRequired && isAuthorized) || !isAuthorizationRequired) {
        return <>{children}</>;
    }

    return <h1 className="text-red-600 text-lg font-bold">Unauthorized access!</h1>;
};

export default RouterGuard;