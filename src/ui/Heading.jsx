import styled, { css } from "styled-components";

/** 
 * because we have a `template literal` ehre, we can enter e JS mode
 and place some condition
 * We can also write css in a external var.
 * To get the sintax highlighting in the external var, use the css function.
   Just import it from styled-components 
 * to get acces to the prop comming from the parent element (App.jsx)
   use a callback function
*/

// const test = css`
//   text-align: center;
// `;
const Heading = styled.h1`
  ${(props) =>
    props.as === "h1" &&
    css`
      font-size: 3rem;
      font-weight: 600;
    `}

  ${(props) =>
    props.as === "h2" &&
    css`
      font-size: 2rem;
      font-weight: 600;
    `}

     ${(props) =>
    props.as === "h3" &&
    css`
      font-size: 1rem;
      font-weight: 500;
    `}

  line-height:1.4
`;

export default Heading;
