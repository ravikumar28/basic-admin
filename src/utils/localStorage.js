export const storageService = {
  setItem: (key, value) => {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  },
  
  getItem: (key, parse = false) => {
    const item = localStorage.getItem(key);
    
    if (parse && item) {
      try {
        return JSON.parse(item);
      } catch (e) {
        console.error('Error parsing localStorage item', e);
        return null;
      }
    }
    
    return item;
  },
  
  removeItem: (key) => {
    localStorage.removeItem(key);
  },
  
  clear: () => {
    localStorage.clear();
  }
};