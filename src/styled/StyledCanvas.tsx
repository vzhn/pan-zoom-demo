import styled from "@emotion/styled";

export const StyledCanvas = styled.canvas<{ width: number, height: number }>`
  border: 1px solid black;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`