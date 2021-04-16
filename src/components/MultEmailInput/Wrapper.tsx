import styled from "@emotion/styled";

const Wrapper = styled.div`
  margin: 0;
  max-width: 100%;
  flex: 1 0 auto;
  outline: 0;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
  text-align: left;
  line-height: 1.22em;
  padding: 0.4em 0.5em;
  background: #fff;
  border: 1px solid rgba(34, 36, 38, 0.15);
  color: rgba(0, 0, 0, 0.87);
  border-radius: 0.3rem;
  transition: box-shadow 0.1s ease, border-color 0.1s ease;
  font-size: 13px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  align-content: flex-start;

  & > span[data-placeholder] {
    display: none;
    position: absolute;
    left: 0.5em;
    top: 0.4em;
    padding: 0.4em;
    line-height: 1.21428571em;
  }

  &.focused {
    border-color: #85b7d9;
    background: #fff;
  }

  &.empty > span[data-placeholder] {
    display: inline;
    color: #ccc;
  }

  &.focused > span[data-placeholder] {
    display: none;
  }

  & > input {
    width: auto !important;
    outline: none !important;
    border: 0 none !important;
    display: inline-block !important;
    line-height: 1;
    vertical-align: baseline !important;
    padding: 0.4em 0.1em !important;
  }

  & [data-tag] {
    line-height: 1;
    vertical-align: baseline;
    margin: 0.14285714em;
    background-color: #f3f3f3;
    background-image: none;
    padding: 0.5833em 0.833em;
    color: rgba(0, 0, 0, 0.6);
    text-transform: none;
    font-weight: 600;
    border: 0 solid transparent;
    border-radius: 0.3rem;
    transition: background 0.1s ease;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    max-width: 100%;
  }

  & [data-tag] [data-tag-item] {
    max-width: 100%;
    overflow: hidden;
  }

  & [data-tag]:first-child {
    margin-left: 0;
  }

  & [data-tag] [data-tag-handle] {
    margin-left: 0.833em;
    cursor: pointer;
  }
`;

export default Wrapper;
