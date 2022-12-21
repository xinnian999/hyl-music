function parseLyric(lyric: string) {
  const lrcObj = {
    ti: "",
    ar: "",
    al: "",
    by: "",
    lrc: [],
  };

  /*
    [ar:艺人名]
    [ti:曲名]
    [al:专辑名]
    [by:编者（指编辑LRC歌词的人）]
    [offset:时间补偿值] 其单位是毫秒，正值表示整体提前，负值相反。这是用于总体调整显示快慢的。
  */

  const lrcArr = lyric
    .split("\n")
    .filter(function (value: any) {
      // 1.通过回车去分割歌词每一行,遍历数组，去除空行空格
      return value.trim() !== "";
    })
    .map(function (value: any) {
      // 2.解析歌词
      const line: any = parseLyricLine(value.trim());
      if (line?.type === "lyric") {
        lrcObj.lrc.push(line.data);
      } else {
        lrcObj[line.type] = line.data;
      }
      return value.trim();
    });

  function parseLyricLine(line: any) {
    const tiArAlByExp = /^\[(ti|ar|al|by):(.*)\]$/;
    const lyricExp = /^\[(\d{2}):(\d{2}).(\d{2}|\d{3})\](.*)/;
    let result;
    if ((result = line.match(tiArAlByExp)) !== null) {
      return {
        type: result[1],
        data: result[2],
      };
    } else if ((result = line.match(lyricExp)) !== null) {
      return {
        type: "lyric",
        data: {
          time: {
            m: result[1],
            s: result[2],
            ms: result[3],
          },
          lyric: result[4].trim(),
        },
      };
    }
  }

  return lrcObj;
}

export default parseLyric;
