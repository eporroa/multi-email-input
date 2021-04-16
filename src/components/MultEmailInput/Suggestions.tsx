import styled from "@emotion/styled";

const Suggestions = styled.ul`
  border: 1px solid #999;
  border-top-width: 0;
  list-style: none;
  margin-top: 0;
  max-height: 143px;
  overflow-y: auto;
  padding-left: 0;

  & li {
    padding: 0.5rem;
  }

  .suggestion-active,
  & li:hover {
    background-color: #008f68;
    color: #fae042;
    cursor: pointer;
    font-weight: 700;
  }

  & li:not(:last-of-type) {
    border-bottom: 1px solid #999;
  }

  .no-suggestions {
    color: #999;
    padding: 0.5rem;
  }
`;

export default Suggestions;
