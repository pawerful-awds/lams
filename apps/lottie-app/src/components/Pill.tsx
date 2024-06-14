import classnames from "classnames";

export interface IPillProps {
  text: string;
  float?: boolean;
}

export const Pill = ({ text, float }: IPillProps) => {
  const _Pill = classnames(
    "px-2 py-0.5 text-[0.70rem] rounded-full bg-gray-100 font-medium justify-start text-black",
    {
      "absolute right-2 top-2 z-10": float,
    }
  );
  return <div className={_Pill}>{text}</div>;
};
