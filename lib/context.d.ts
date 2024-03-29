import { MouseEventHandler, TouchEventHandler } from "react";
export declare type SplitterMode = 'maximize' | 'minimize' | 'resize';
export interface ISplitState {
    isFixed: boolean;
    split: "horizontal" | "vertical";
    sticky: number;
    maxSize: number;
    minSize: number;
    keepRatio: boolean;
    disable: boolean;
    size: number;
    ratio: number;
    mode: SplitterMode;
    isResizing: boolean;
    isMainSecond(): boolean;
    getContainerSize(): number;
    getMainSize(): number;
    getMainSizeStyle(): string;
    setMode(mode: SplitterMode): void;
    setSize(size: number, updateRatio?: boolean): void;
    setDisable(state: boolean): void;
    onMouseDown: MouseEventHandler<HTMLDivElement>;
    onTouchStart: TouchEventHandler<HTMLDivElement>;
    onTouchEnd: TouchEventHandler<HTMLDivElement>;
    onClick: MouseEventHandler<HTMLDivElement>;
    onDoubleClick: MouseEventHandler<HTMLDivElement>;
}
export declare const defaultState: {
    split: string;
    isResizing: boolean;
};
export declare const SplitContext: import("react").Context<ISplitState>;
