'use strict';

class Common {

}
Common.NAME = 'booq Cashregister';
Common.DEBUG_MODE = true;
Common.WINDOW_SIZE = {
    width: 1200,
    height: 600,
};

Common.USER_AGENT = {
    freebsd: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    sunos: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    win32: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    linux: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
    darwin: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36',
};

Common.SHOP_URL = 'https://shop.booqticketing.com/FzKYMhBh/kassa/login';

Common.GIT_API_HOST = 'api.github.com';
Common.GIT_API_RELEASE_LATEST_PATH = '/repos/geeeeeeeeek/electronic-wechat/releases/latest';

Common.UPDATE_ERROR_ELECTRON = `Failed to get the local version. If you are using debug mode(by \`npm start\`), this error would happen. Use packed app instead or manually check for updates.\n\n${Common.GITHUB_RELEASES}`;
Common.UPDATE_ERROR_EMPTY_RESPONSE = 'Failed to fetch release info.';
Common.UPDATE_ERROR_UNKNOWN = 'Something went wrong.';
Common.UPDATE_NA_TITLE = 'No Update Available';
Common.UPDATE_ERROR_NETWORK = 'Connection hang up unexpectedly. Check your network settings.';
Common.UPDATE_ERROR_LATEST = (version) => {
    return `You are using the latest version(${version}).`;
};

module.exports = Common;