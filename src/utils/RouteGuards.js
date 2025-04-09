import { useEffect, useState } from 'react';

const IsSignedInGuard = ({ children, user, uri }) => {
    const [routeGuardFailed, setRouteGuardFailed] = useState(false);

    useEffect(() => {
        if (!user) {
            if (!routeGuardFailed) {
                setRouteGuardFailed(true);
                window.location.replace(uri); // Hard refresh to the provided URI
            } else {
                window.location.replace("/"); // If the route guard fails again, hard refresh to the home page
            }
        }
    }, [user, uri, routeGuardFailed]);

    // This condition prevents the component from rendering its children
    // before the effect runs, which could prevent unwanted flashes of content.
    if (!user) {
        return null;
    }

    return children;
};

const IsMemberGuard = ({ children, user, uri }) => {
    const [routeGuardFailed, setRouteGuardFailed] = useState(false);

    useEffect(() => {
        if (!user || user.memberstatus !== 'verified') {
            if (!routeGuardFailed) {
                setRouteGuardFailed(true);
                window.location.replace(uri);
            } else {
                window.location.replace("/");
            }
        }
    }, [user, uri, routeGuardFailed]);

    if (!user || user.memberstatus !== 'verified') {
        return null;
    }

    return children;
};

export { IsSignedInGuard, IsMemberGuard };