import styles from "./style.less";

type BannerType = {
  title: string;
};

export default function Banner({ title }: BannerType) {
  return (
    <div id={styles.banner}>
      <h1>{title}</h1>
      <p>
        更新日期：{new Date().getMonth() + 1}月{new Date().getDate()}日
      </p>
    </div>
  );
}
