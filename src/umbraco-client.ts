const {
  UMBRACO_ROOT_NODE,
  UMBRACO_PREVIEW_API_KEY,
  PUBLIC_DEFAULT_LOCALE,
  PUBLIC_UMBRACO_URL,
} = import.meta.env;

class UmbracoClient {
  private deliveryApiPath = '/delivery/api/v2/content';
  private deliveryApiUrl: string;

  constructor(domain: string) {
    this.deliveryApiUrl = `${domain}${this.deliveryApiPath}`;
  }

  private getHeaders(
    preview: boolean = false,
    culture: string = PUBLIC_DEFAULT_LOCALE,
  ) {
    const headers: Record<string, string | boolean> = {
      'Api-Key': UMBRACO_PREVIEW_API_KEY,
    };
    if (preview) headers.Preview = true;
    if (culture?.length > 0) headers['Accept-Language'] = culture;
    return headers;
  }

  private generateQueryParams(
    hasExistingParams = false, // Url already has ?, can therefore use &
    params: {
      sort?: string; // createDate, level, name, sortOrder, updateDate (:asc or :desc)
      expand?: string; // $all or alias
      fields?: string; // alias of fields to include (default $all)
      filter?: string; // contentType:alias, name:nodeName, createDate>date,updateDate>date (can have multiple, filter=...&filter=)
      take?: string | number; // Pagination
      skip?: string | number; // Pagination
    } = {
      sort: 'sortOrder:asc',
      expand: '$all',
      take: '',
      fields: '$all',
      filter: '',
    },
  ) {
    let queryParams = hasExistingParams ? '&' : '?';
    const queryArray = [];

    /*  sort - String Array - Sorting query string options (e.g. createDate, level, name, sortOrder, updateDate) */
    if (params.sort) {
      queryArray.push(`sort=${params.sort}`);
    }

    /* take - Integer - Amount of items to take */
    if (params.take) {
      queryArray.push(`take=${params.take}`);
    }

    /* skip - Integer - Amount of items to skip */
    if (params.skip) {
      queryArray.push(`skip=${params.skip}`);
    }

    /* fields - String - Which properties to include in the response (by default all properties are included) */
    if (params.fields) {
      queryArray.push(`fields=properties[${params.fields}]`);
    }

    /* filter - String Array - Filtering query string options (e.g. contentType, name, createDate, updateDate) */
    if (params.filter) {
      queryArray.push(`${params.filter}`);
    }

    /* expand - String - Which properties to expand and therefore include in the output if they refer to another piece of content */
    if (params.expand) {
      queryArray.push(`expand=properties[${params.expand}]`);
    }

    queryParams += queryArray.join('&');

    return queryParams;
  }

  // https://1251167-www.web.tornado-node.net/umbraco/delivery/api/v2/content/item//om-oss/?expand=properties[$all]
  // Returns object by passing pathname
  async getContentByUrl(
    path: string,
    {
      preview = false,
      culture = '',
      sort = '', // 'sortOrder:asc',
      expand = '$all',
    },
  ) {
    const headers = this.getHeaders(preview, culture);
    const queryParams = this.generateQueryParams(false, { sort, expand });
    const url = `${this.deliveryApiUrl}/item/${path}${queryParams}`;
    const response = await fetch(url, { method: 'GET', headers });
    return response.json();
  }

  // https://1251167-www.web.tornado-node.net/umbraco/delivery/api/v2/content/item/a6244e26-7dd6-4bf6-9052-d276e3ed827c
  // Returns object by passing guid
  async getContentByGuid(
    id: string,
    {
      preview = false,
      culture = '',
      sort = '', // 'sortOrder:asc',
      expand = '',
    },
  ) {
    const headers = this.getHeaders(preview, culture);
    const queryParams = this.generateQueryParams(false, { sort, expand });
    const url = `${this.deliveryApiUrl}/item/${id}${queryParams}`;
    const response = await fetch(url, { method: 'GET', headers });
    return response.json();
  }

  // https://1251167-www.web.tornado-node.net/umbraco/delivery/api/v2/content?fetch=descendants:a6244e26-7dd6-4bf6-9052-d276e3ed827c&expanded=all&sort=sortOrder:asc
  // Returns multiple levels of children
  async getDescendants(
    id: string,
    {
      preview = false,
      culture = '',
      sort = '',
      expand = '',
      take = '999',
      fields,
    },
  ) {
    const headers = this.getHeaders(preview, culture);
    const queryParams = this.generateQueryParams(true, {
      sort,
      expand,
      take,
      fields,
    });
    const url = `${this.deliveryApiUrl}?fetch=descendants:${id}${queryParams}`;
    const response = await fetch(url, { method: 'GET', headers });
    return response.json();
  }

  // https://1251167-www.web.tornado-node.net/umbraco/delivery/api/v2/content?fetch=children:a6244e26-7dd6-4bf6-9052-d276e3ed827c&expanded=all&sort=sortOrder:asc
  // Returns immediate children
  async getChildren(
    id: string,
    {
      preview = false,
      culture = '',
      sort = '',
      expand = '',
      take = '999',
      fields,
    },
  ) {
    const headers = this.getHeaders(preview, culture);
    const queryParams = this.generateQueryParams(true, {
      sort,
      expand,
      take,
      fields,
    });
    const url = `${this.deliveryApiUrl}?fetch=children:${id}${queryParams}${queryParams}`;
    const response = await fetch(url, { method: 'GET', headers });
    return response.json();
  }

  // https://1251167-www.web.tornado-node.net/umbraco/delivery/api/v2/content?fetch=descendants:a6244e26-7dd6-4bf6-9052-d276e3ed827c&fields=properties[hideFromSitemap]&take=999
  // Get all urls for sitemap
  async getAllUrls(culture) {
    return this.getDescendants(UMBRACO_ROOT_NODE, {
      preview: false,
      culture: culture,
      sort: '',
      expand: '',
      take: '999',
      fields: 'hideFromSitemap',
    });
  }
}

export default new UmbracoClient(PUBLIC_UMBRACO_URL);
