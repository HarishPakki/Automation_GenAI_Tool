export const parseInsomniaCollection = (jsonData) => {
  try {
    const collection = {
      id: jsonData.resources.find(r => r.type === 'workspace')?.id || `col_${Date.now()}`,
      name: jsonData.resources.find(r => r.type === 'workspace')?.name || 'Imported Collection',
      version: '1.0',
      requests: []
    };

    // Parse requests
    jsonData.resources.filter(r => r.type === 'request').forEach(request => {
      const parsedRequest = {
        id: request.id,
        name: request.name,
        method: request.method,
        url: request.url,
        headers: request.headers || [],
        body: request.body ? (typeof request.body === 'string' ? tryParseJson(request.body) : request.body) : null,
        description: request.description,
        preRequestScript: request.preRequestScript,
        tests: request.tests
      };
      
      collection.requests.push(parsedRequest);
    });

    return collection;
  } catch (error) {
    console.error('Error parsing Insomnia collection:', error);
    throw new Error('Failed to parse Insomnia collection');
  }
};

const tryParseJson = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
};