const PREFERENCES = "preferences";

export const PAGE_TABLE = "page";

export const REMEMBERME = "rememberme";

/**
 * Return the preferences of the tables than can be saved
 * 
 * @param {string} resourceUrl
 * @returns (string)
 */

export const getPreferencesUrlStorage = (resourceUrl = "") => {
    return `${PREFERENCES}_${resourceUrl}`;
};

export const preferencesToStorage = {
    PAGE_TABLE,
    REMEMBERME
};