import { useEffect, useState } from 'react';
import { accountApi, organizationApi } from '../api';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';

/**
 * Manages all notification states and logic for the application
 * @returns {Object} An object containing notification states and utility functions
 */
const useNotifications = () => {
    const { user, isAdmin } = useAuth();
    const [notifications, setNotifications] = useState({
        Settings: 0,
        Messages: 0,
        Membership: 0
    });
    const [pendingMembers, setPendingMembers] = useState(0);
    const [pendingOrgs, setPendingOrgs] = useState(0);
    const [recentlyVerified, setRecentlyVerified] = useState(false);

    // Fetch initial notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            if (user) {
                try {
                    const notificationData = await accountApi.getNotifications();
                    if (user.recentlyverified) {
                        setNotifications({
                            ...notificationData,
                            Messages: notificationData.chat_notifications_count || 0,
                            Settings: 3,
                            Membership: 1,
                        });
                        setRecentlyVerified(true);
                    } else {
                        setNotifications({
                            ...notificationData,
                            Messages: notificationData.chat_notifications_count || 0,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching notifications:", error);
                }
            }
        };

        fetchNotifications();
    }, [user]);

    // Check membership renewal notification
    useEffect(() => {
        if (user && dayjs(user.renewdate).diff(dayjs(), "day") <= 14) {
            setNotifications(prev => ({
                ...prev,
                Membership: 1,
            }));
        }
    }, [user]);

    // Handle admin-specific notifications
    useEffect(() => {
        const fetchPendingItems = async () => {
            if (!isAdmin) return;

            try {
                const members = await accountApi.getPendingMembers();
                setPendingMembers(members);

                const orgs = await organizationApi.getPendingOrganizations();
                setPendingOrgs(orgs.length);
            } catch (error) {
                console.error("Error fetching pending items:", error);
            }
        };

        if (isAdmin) {
            fetchPendingItems();
        }
    }, [isAdmin]);

    // Handle recently verified status updates
    useEffect(() => {
        if (recentlyVerified) {
            const totalNotifications = notifications.Settings + notifications.Membership;
            if (totalNotifications === 0) {
                updateRecentlyVerified(false);
                setRecentlyVerified(false);
            }
        }
    }, [recentlyVerified, notifications]);

    const updateRecentlyVerified = async (value) => {
        try {
            await accountApi.updateRecentlyVerified(value);
        } catch (error) {
            console.error("Error updating recently verified status:", error);
        }
    };

    // Function to clear specific notification types
    const clearNotification = (type) => {
        setNotifications(prev => ({
            ...prev,
            [type]: 0
        }));
    };

    // Function to get total notification count including all potential notifications
    const getTotalNotifications = ({
                                       isMemberFormDisabled = false,
                                       checkedMembershipInfo = false,
                                       isEmailConfirmed = true
                                   } = {}) => {
        return notifications.Membership +
            notifications.Settings +
            notifications.Messages +
            pendingMembers +
            pendingOrgs +
            (!isMemberFormDisabled && !checkedMembershipInfo ? 1 : 0) +
            (!isEmailConfirmed ? 1 : 0);
    };

    // Check if member form should be disabled based on user status
    const isMemberFormDisabled = user?.memberstatus !== "unverified";

    // Check membership info status
    const [checkedMembershipInfo, setCheckedMembershipInfo] = useState(() => {
        return localStorage.getItem("checkedMembershipInfo") === "true";
    });

    const setMembershipInfoChecked = (checked) => {
        setCheckedMembershipInfo(checked);
        localStorage.setItem("checkedMembershipInfo", checked.toString());
    };

    return {
        notifications,
        pendingMembers,
        pendingOrgs,
        clearNotification,
        getTotalNotifications,
        recentlyVerified,
        updateRecentlyVerified,
        isMemberFormDisabled,
        checkedMembershipInfo,
        setMembershipInfoChecked
    };
};

export default useNotifications;