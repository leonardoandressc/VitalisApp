/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

function ThemeToggle({ isDark, toggle }) {
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title="Cambiar modo claro/oscuro"
      css={css`
        position: absolute;
        top: 1rem;
        right: 1rem;
        width: 12vw;
        max-width: 40px;
        height: 6vw;
        max-height: 20px;
        background: ${isDark ? "#1CD4C3" : "#ccc"};
        border-radius: 16px;
        border: none;
        cursor: pointer;
        padding: 0;
        transition: background-color 0.3s ease;

        &:hover {
          background: ${isDark ? "#17b8ad" : "#bbb"};
        }

        span {
          display: block;
          width: 5.2vw;
          max-width: 18px;
          height: 5.2vw;
          max-height: 18px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease;
          transform: translateX(${isDark ? "calc(100%)" : "3px"});
          margin: 1px;
        }

        @media (max-width: 400px) {
          top: 0.5rem;
          right: 0.5rem;
          width: 40px;
          height: 20px;

          span {
            width: 18px;
            height: 18px;
            margin: 1px;
            transform: translateX(${isDark ? "calc(100%)" : "3px"});
          }
        }
      `}
    >
      <span />
    </button>
  );
}

export default ThemeToggle;

