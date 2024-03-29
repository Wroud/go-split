import { ISplitState, SplitterMode } from "./context";
import React, { PropsWithChildren } from "react";
export interface SplitProps extends PropsWithChildren {
    split?: "horizontal" | "vertical";
    mode?: SplitterMode;
    size?: number;
    ratio?: number;
    sticky?: number;
    minSize?: number;
    maxSize?: number;
    keepRatio?: boolean;
    disable?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onModeChange?(mode: SplitterMode): void;
    onResize?(size: number, ratio: number): void;
    onDisable?(disable: boolean): void;
}
export declare class Split extends React.Component<SplitProps, ISplitState> {
    protected get mainRef(): HTMLDivElement | null;
    protected get secondRef(): HTMLDivElement | null;
    protected splitRef: React.RefObject<HTMLDivElement>;
    protected sizeObserver: ResizeObserver;
    static getDerivedStateFromProps(props: SplitProps, state: ISplitState): Partial<ISplitState> | null;
    constructor(props: SplitProps);
    isMainSecond: () => boolean;
    getMainSizeStyle: () => string;
    getContainerSize: () => number;
    getMainSize: () => number;
    getSecondSize: () => number;
    getMainOffset: () => number;
    getSecondOffset: () => number;
    getContainerOffset: (inverse?: boolean) => number;
    stopResize: () => void;
    startResize: (clientX: number, clientY: number) => void;
    resize: (clientX: number, clientY: number) => void;
    setDisable: (disable: boolean) => void;
    setSize: (size: number, updateRatio?: boolean) => void;
    setMode: (mode: SplitterMode) => void;
    handleReactStartResize: (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
    onStartResize: (event: TouchEvent | MouseEvent) => void;
    handleReactEndResize: (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
    onEndResize: (event: TouchEvent | MouseEvent) => void;
    onDoubleClick: (event: React.SyntheticEvent<HTMLDivElement>) => void;
    onMouseMove: (event: MouseEvent) => void;
    onTouchMove: (event: TouchEvent) => void;
    onSplitResize: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
    private getSize;
}
