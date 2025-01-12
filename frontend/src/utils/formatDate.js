export const formatDate = (dateString) => {
    const getDaySuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  
    const date = new Date(dateString);
  
    const day = date.getDate();
    const dayWithSuffix = day + getDaySuffix(day);
  
    const options = { month: 'long', year: 'numeric' };
    const monthAndYear = date.toLocaleDateString('en-US', options);
  
    return `${dayWithSuffix} ${monthAndYear}`;
  };
  