
// External components
import { useHotkeys } from 'react-hotkeys-hook';

const SITE = import.meta.env.PUBLIC_SITE_URL;
const REPO = import.meta.env.PUBLIC_GITHUB_REPO;
const UMBRACO = import.meta.env.PUBLIC_UMBRACO_URL;
const CLOUDFLARE_DASH = import.meta.env.PUBLIC_CLOUDFLARE_DASH;
const openUrl = (url, target = "_blank") => {
    window.open(url, target).focus();
};
const AllHotkeys = () => {
    useHotkeys('alt+shift+l', () => {
        openUrl(SITE.replace(/\/$/, "") + window.location.pathname);
    });
    useHotkeys('alt+shift+g', () => {
        openUrl(REPO);
    });
    useHotkeys('alt+shift+u', () => {
        let currentId = document.body.getAttribute("data-page-id");
        openUrl(`${UMBRACO}#/content/content/edit/${currentId}`);
    });
    useHotkeys('alt+shift+c', () => openUrl(CLOUDFLARE_DASH));
};

export default AllHotkeys;