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
    if (!domain) {
      throw new Error('Domain must be provided');
    }
    this.deliveryApiUrl = `${domain}${this.deliveryApiPath}`;
  }

  private getHeaders(
    preview: boolean = false,
    culture: string = PUBLIC_DEFAULT_LOCALE,
  ) {
    const headers: Record<string, string | boolean> = {};

    // Add API key header if it's available
    if (UMBRACO_PREVIEW_API_KEY) {
      headers['Api-Key'] = UMBRACO_PREVIEW_API_KEY;
    }

    // Add preview header if preview mode is enabled
    if (preview) headers.Preview = true;

    // Add Accept-Language header if culture is provided
    if (culture?.length > 0) headers['Accept-Language'] = culture;

    return headers;
  }

  private generateQueryParams(
    hasExistingParams = false,
    params: {
      sort?: string;
      expand?: string;
      fields?: string;
      filter?: string;
      take?: string | number;
      skip?: string | number;
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

    if (params.sort) {
      queryArray.push(`sort=${params.sort}`);
    }

    if (params.take) {
      queryArray.push(`take=${params.take}`);
    }

    if (params.skip) {
      queryArray.push(`skip=${params.skip}`);
    }

    if (params.fields) {
      queryArray.push(`fields=properties[${params.fields}]`);
    }

    if (params.filter) {
      queryArray.push(`${params.filter}`);
    }

    if (params.expand) {
      queryArray.push(`expand=properties[${params.expand}]`);
    }

    queryParams += queryArray.join('&');

    return queryParams;
  }

  async getContentByGuidOrPath(
    id: string,
    { preview = false, culture = '', sort = '', expand = '' } = {},
  ) {
    try {
      const headers = this.getHeaders(preview, culture);
      const queryParams = this.generateQueryParams(false, { sort, expand });
      const url = `${this.deliveryApiUrl}/item/${id}${queryParams}`;
      const response = await fetch(url, { method: 'GET', headers });

      if (!response.ok) {
        console.error(`Error fetching content by GUID: ${url}`);
        return null;
      }

      const data = await response.json();
      return Object.keys(data).length > 0 ? data : null;
    } catch (error) {
      console.error(`Failed to fetch content by GUID (${id}):`, error);
      return null;
    }
  }

  async getDescendants(
    id: string,
    {
      preview = false,
      culture = '',
      sort = '',
      expand = '',
      take = '999',
      fields,
    } = {},
  ) {
    try {
      const headers = this.getHeaders(preview, culture);
      const queryParams = this.generateQueryParams(true, {
        sort,
        expand,
        take,
        fields,
      });
      const url = `${this.deliveryApiUrl}?fetch=descendants:${id}${queryParams}`;
      const response = await fetch(url, { method: 'GET', headers });

      if (!response.ok) {
        console.error(`Error fetching descendants: ${url}`);
        return null;
      }

      const data = await response.json();
      return Object.keys(data).length > 0 ? data : null;
    } catch (error) {
      console.error(`Failed to fetch descendants for ID (${id}):`, error);
      return null;
    }
  }

  async getChildren(
    id: string,
    {
      preview = false,
      culture = '',
      sort = '',
      expand = '',
      take = '999',
      fields,
    } = {},
  ) {
    try {
      const headers = this.getHeaders(preview, culture);
      const queryParams = this.generateQueryParams(true, {
        sort,
        expand,
        take,
        fields,
      });
      const url = `${this.deliveryApiUrl}?fetch=children:${id}${queryParams}`;
      const response = await fetch(url, { method: 'GET', headers });

      if (!response.ok) {
        console.error(`Error fetching children: ${url}`);
        return null;
      }

      const data = await response.json();
      return Object.keys(data).length > 0 ? data : null;
    } catch (error) {
      console.error(`Failed to fetch children for ID (${id}):`, error);
      return null;
    }
  }

  async getAllUrls(culture: string) {
    try {
      return await this.getDescendants(UMBRACO_ROOT_NODE, {
        preview: false,
        culture: culture,
        sort: '',
        expand: '',
        take: '999',
        fields: 'hideFromSitemap',
      });
    } catch (error) {
      console.error('Failed to fetch all URLs:', error);
      return null;
    }
  }
}

export default new UmbracoClient(PUBLIC_UMBRACO_URL);
