export const handleFill = (fill: any, setFill: any) => {
    fill ? setFill(false) : setFill(true) 
  }

export const handleSeries = (series: any, setSeries: any) => {
   series ? setSeries(false) : setSeries(true) 
}

export const handleRemoveCategory = (category: string, setCategories: any, categories: any) => {
    setCategories(categories.filter((cat: any) => cat !== category));
};
