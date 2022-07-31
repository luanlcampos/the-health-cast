import styles from "../../styles/Footer.module.scss";
import Link from "next/link";
const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className="wrapper">
        <small className={styles.small}>
          &copy;2022 <strong>Health Cast App</strong>, All Rights Reserved
        </small>
        {/* <nav className="footeNav">
          <Link className={styles.a} href="/">
            Back to Top
          </Link>
          <Link className={styles.a} href="/">
            Terms of Use
          </Link>
          <Link className={styles.a} href="/">
            Privacy
          </Link>
        </nav> */}
      </div>
    </footer>
  );
};

export default Footer;
