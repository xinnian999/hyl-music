const getArtist = (data: any[]) => {
  return data
    .map((item) => item.name)
    .reduce((item, str) => {
      return `${item} / ${str}`;
    });
};

export default getArtist;
