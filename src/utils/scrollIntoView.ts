const scrollIntoView = (name: string) => {
  const el = document.querySelector(name);
  el?.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });

  // el.parentNode.scrollTop = el.offsetTop;
};

export default scrollIntoView;
