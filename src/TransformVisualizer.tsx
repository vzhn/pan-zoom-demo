import { useEffect } from 'react';
import { useRemark } from 'react-remark';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import 'katex/dist/katex.min.css'
import {Point, TransformationMatrix} from "./PanZoom";

const TransformVisualizer = ({matrix, mousePosition, mouseProjectionPosition}: {
  matrix: TransformationMatrix,
  mousePosition: Point,
  mouseProjectionPosition: Point
}) => {
  const [reactContent, setMarkdownSource] = useRemark({
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex as any]
  });

  const mdLatex =
    '# screen → scene \n' +
    matrixMulVectorToString(matrix.inv(), mousePosition, mouseProjectionPosition) + '\n' +
    '# scene → screen \n' +
      matrixMulVectorToString(matrix, mouseProjectionPosition, mousePosition);
  useEffect(() => setMarkdownSource(mdLatex), [matrix, mousePosition]);

  return reactContent;
};

const matrixMulVectorToString = (matrix: TransformationMatrix, {x, y}: Point, {x: rx, y: ry}: Point): string => {
  const toString = (n: number) => n.toFixed(2)

  const {a, b, c, d, e, f} = matrix
  const [as, bs, cs, ds, es, fs] = [a, b, c, d, e, f].map(toString)

  const latexMatrix = `\\begin{bmatrix*} ${as} & ${cs} & ${es} \\\\ ${bs} & ${ds} & ${fs} \\\\ 0 & 0 & 1 \\end{bmatrix*}`;
  const latexMouse = `\\begin{bmatrix*} ${toString(x)}  \\\\ ${toString(y)} \\\\ 0 \\end{bmatrix*}`;
  const latexMouseProj =  `\\begin{bmatrix*} ${toString(rx)}  \\\\ ${toString(ry)} \\\\ 0 \\end{bmatrix*}`;

  return `$$ ${latexMatrix} ${latexMouse} = ${latexMouseProj} $$`;
}

export default TransformVisualizer;