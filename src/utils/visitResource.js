export const RESOURCE = {
    VCL_RESOURCE: 'vcl_resource',
    FEATURED_BOOKS: 'featured_books',
    DOST_RESOURCE: 'dost_resource',
    NLP_RESOURCE: 'nlp_resource',
    LETS_READ_RESOURCE: 'lets_read_resource'
};

export function visitResource(resource) {
    // Map the enum to its value
    const resourceValue = RESOURCE[resource] || resource;

    // Get existing resources data from localStorage
    const storageKey = 'resources';
    
    // Initialize with predefined keys set to 0
    const defaultResourcesData = {
        vcl_resource: 0,
        featured_books: 0,
        nlp_resource: 0,
        dost_resource: 0,
        lets_read_resource: 0
    };
    
    let resourcesData = { ...defaultResourcesData };
    
    try {
        const storedData = localStorage.getItem(storageKey);
        if (storedData) {
            resourcesData = { ...defaultResourcesData, ...JSON.parse(storedData) };
        }
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        resourcesData = { ...defaultResourcesData };
    }
    
    // Increment the visit count for the resource
    if (resourcesData[resourceValue]) {
        resourcesData[resourceValue] += 1;
    } else {
        resourcesData[resourceValue] = 1;
    }
    
    // Save updated data back to localStorage
    try {
        localStorage.setItem(storageKey, JSON.stringify(resourcesData));
    } catch (error) {
        console.error('Error writing to localStorage:', error);
    }
    
    return resourcesData[resourceValue];
}