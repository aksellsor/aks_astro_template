import translations from '@src/data/translation.json';

let PUBLIC_DEFAULT_LOCALE = import.meta.env.PUBLIC_DEFAULT_LOCALE;
let PUBLIC_IMAGE_CDN = import.meta.env.PUBLIC_IMAGE_CDN;
function l(locale: string, string: string): string {
  if (translations[string] && translations[string][locale]) {
    return translations[string][locale];
  }
  return string;
}

function getLangPrefixFromPathname(pathname: string) {
  const NOT_DEFAULT_LOCALES =
    import.meta.env.PUBLIC_OTHER_LOCALES?.split(',') || [];
  const prefix = NOT_DEFAULT_LOCALES.includes(pathname.split('/')[1])
    ? pathname.split('/')[1]
    : '';
  return prefix || PUBLIC_DEFAULT_LOCALE;
}

function translate(pathname: string, string: string): string {
  let prefix = getLangPrefixFromPathname(pathname);
  return l(prefix, string);
}
function isMobileUserAgent(userAgent) {
  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  return mobileRegex.test(userAgent);
}

function getFirstItem(array: any[], keys: string[] = []) {
  if (Array.isArray(array) && array.length > 0) {
    let firstItem = array[0];

    if (Array.isArray(keys) && keys.length > 0) {
      firstItem = Object.keys(firstItem)
        .filter((key) => keys.includes(key))
        .reduce((obj, key) => {
          obj[key] = firstItem[key];
          return obj;
        }, {});
    }

    return firstItem;
  } else {
    return array; // eller undefined, avhengig av hva du foretrekker
  }
}
const umbracoLink = (item) => {
  let props = item?.content?.properties;
  let link = getFirstItem(props?.link || item, [
    'url',
    'title',
    'target',
    'route',
    'queryString',
  ]);
  let url = link?.route?.path || link?.url + (link?.queryString || '');
  return {
    href: url,
    title: link?.title,
    target: link?.target || (url?.startsWith('/') ? '_self' : '_blank'),
  };
};
function umbracoMedia(image, params = '') {
  if (!image) return;
  const { url, name } = image[0];
  return { url: `${PUBLIC_IMAGE_CDN}${url}${params}`, name };
}

export {
  isMobileUserAgent,
  l,
  translate,
  getFirstItem,
  umbracoLink,
  umbracoMedia,
  getLangPrefixFromPathname,
};
