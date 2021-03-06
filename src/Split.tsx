import { SplitContext, ISplitState, defaultState, SplitterMode } from "./context";
import React, { Props } from "react";

export interface SplitProps extends Props<any> {
  split?: "horizontal" | "vertical";
  mode?: SplitterMode;
  sticky?: number;
  minSize?: number;
  maxSize?: number;
  keepRatio?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export class Split extends React.Component<SplitProps, ISplitState> {
  splitRef: React.RefObject<HTMLDivElement>;
  mainRef: React.RefObject<HTMLDivElement>;
  secondRef: React.RefObject<HTMLDivElement>;
  isModeSetByUser: boolean;

  static getDerivedStateFromProps(
    props: SplitProps,
    state: ISplitState
  ): Partial<ISplitState> | null {
    if (
      props.split !== state.split ||
      props.maxSize !== state.maxSize ||
      props.minSize !== state.minSize ||
      props.sticky !== state.sticky ||
      props.keepRatio !== state.keepRatio ||
      props.mode !== state.mode
    ) {
      return {
        split: props.split || "vertical",
        sticky: props.sticky || 0,
        maxSize: props.maxSize || -1,
        minSize: props.minSize || -1,
        keepRatio: !!props.keepRatio,
        isFixed: !!props.mode,
        mode: props.mode || (state.isFixed ? 'resize' : state.mode),
      };
    }
    return null;
  }

  constructor(props: SplitProps) {
    super(props);
    this.splitRef = React.createRef<HTMLDivElement>();
    this.mainRef = React.createRef<HTMLDivElement>();
    this.secondRef = React.createRef<HTMLDivElement>();
    this.isModeSetByUser = false;

    this.state = {
      ...defaultState,
      isFixed: !!props.mode,
      split: props.split || "vertical",
      sticky: props.sticky || -1,
      maxSize: props.maxSize || -1,
      minSize: props.minSize || -1,
      keepRatio: !!props.keepRatio,
      size: props.minSize || -1,
      ratio: -1,
      mode: props.mode ||'resize',
      mainRef: this.mainRef,
      secondRef: this.secondRef,
      isMainSecond: this.isMainSecond,
      getContainerSize: this.getContainerSize,
      getMainSize: this.getMainSize,
      getMainSizeStyle: this.getMainSizeStyle,
      setMode: this.setMode,
      setSize: this.setSize,
      onMouseDown: this.onStartResize,
      onTouchStart: this.onStartResize,
      onClick: this.onEndResize,
      onTouchEnd: this.onEndResize,
      onDoubleClick: this.onDoubleClick,
    };
  }
  isMainSecond = () => {
    return this.getSecondOffset() < this.getMainOffset() 
      || (this.getSecondOffset() === this.getContainerOffset() 
          && this.getSecondSize() === 0
          && this.getMainSize() !== 0);
  }
  getMainSizeStyle = () => {
    switch(this.state.mode){
      case 'minimize':
        return '0px';
      case 'maximize':
        return '100%';
      default:
        return `${this.state.size}px`;
    }
  }
  getContainerSize = () => this.getSize(this.splitRef.current);
  getMainSize = () => this.getSize(this.mainRef.current);
  getSecondSize = () => this.getSize(this.secondRef.current);
  getMainOffset = () => {
    if (!this.mainRef.current) {
      return -1;
    }
    const rect = this.mainRef.current.getBoundingClientRect();
    if (this.state.split === "vertical") {
      return rect.left;
    }
    return rect.top;
  };
  getSecondOffset = () => {
    if (!this.secondRef.current) {
      return -1;
    }
    const rect = this.secondRef.current.getBoundingClientRect();
    if (this.state.split === "vertical") {
      return rect.left;
    }
    return rect.top;
  };
  getContainerOffset = (inverse?: boolean) => {
    if (!this.splitRef.current) {
      return -1;
    }
    const rect = this.splitRef.current.getBoundingClientRect();
    if (this.state.split === "vertical") {
      return rect.left + (inverse ? rect.width : 0);
    }
    return rect.top + (inverse ? rect.height : 0);
  };
  stopResize = () => {
    this.setState({
      isResizing: false
    });
  };
  startResize = () => {
    this.setState(state => ({
      size: state.size === -1 ? this.getMainSize() : state.size,
      isResizing: true
    }));
  };
  resize = (clientX: number, clientY: number) => {
    if (!this.state.isResizing) {
      return;
    }
    const clientPosition = this.state.split === "vertical" ? clientX : clientY;
    let newSize = -1;
    if (this.isMainSecond()) {
      newSize = this.getContainerOffset(true) - clientPosition;
    } else {
      newSize = clientPosition - this.getContainerOffset();
    }
    this.setSize(newSize, true);
  };
  setSize = (size: number, updateRatio?: boolean) => {
    let newSize = size;
    let mode = this.state.mode;

    if (this.state.maxSize > -1 && newSize > this.state.maxSize) {
      newSize = this.state.maxSize;
    }
    if (this.state.minSize > -1 && newSize < this.state.minSize) {
      newSize = this.state.minSize;
    }

    const sideSize = this.getContainerSize();
    if (sideSize !== -1 && (!this.isModeSetByUser || updateRatio)) {
      if(mode !== 'maximize' && newSize < this.state.sticky) {
        if(updateRatio) {
          newSize = 0;
        }
        mode = 'minimize';
      } else if(sideSize < newSize + this.state.sticky) {
        if(updateRatio) {
          newSize = sideSize;
        }
        mode = 'maximize';
      } else {
        mode = 'resize';
      }
      this.isModeSetByUser = !!updateRatio && mode !== 'resize';
    }

    this.setState(state => ({
      size: newSize,
      mode,
      ratio: updateRatio ? newSize / sideSize : state.ratio
    }));
  };
  setMode = (mode: SplitterMode) => {
    const resetSize = this.isModeSetByUser;
    this.isModeSetByUser = mode !== 'resize';
    this.setState(state => ({
      mode,
      size: resetSize ? -1 : state.size 
    }));
  };
  onStartResize = (event: Event | React.SyntheticEvent<HTMLDivElement>) => {
    if(event.target !== event.currentTarget){
      return;
    }
    this.startResize();
  };
  onEndResize = (event: Event | React.SyntheticEvent<HTMLDivElement>) => {
    if (!this.state.isResizing || event.target !== event.currentTarget) {
      return;
    }
    this.stopResize();
  };
  onDoubleClick = (event: React.SyntheticEvent<HTMLDivElement>) => {
    if(event.target !== event.currentTarget){
      return;
    }
  };
  onMouseMove = (event: MouseEvent) => {
    if (!this.state.isResizing) {
      return;
    }
    event.preventDefault();
    const { clientX, clientY } = event;
    this.resize(clientX, clientY);
  };
  onTouchMove = (event: TouchEvent) => {
    if (!this.state.isResizing) {
      return;
    }
    event.preventDefault();
    const { clientX, clientY } = event.touches[0];
    this.resize(clientX, clientY);
  };
  onSplitResize = (event: UIEvent) => {
    if (this.state.size !== -1) {
      if(this.state.keepRatio) {
        this.setSize(Math.round(this.state.ratio * this.getContainerSize()));
      } else {
        this.setSize(this.state.size);
      }
    }
  };

  componentDidMount() {
    window.addEventListener("resize", this.onSplitResize);
    document.addEventListener("mouseup", this.onEndResize);
    document.addEventListener("mousemove", this.onMouseMove);

    document.addEventListener("touchmove", this.onTouchMove);
    document.addEventListener("touchend", this.onEndResize);
    document.addEventListener("touchcancel", this.onEndResize);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.onSplitResize);
    document.removeEventListener("mouseup", this.onEndResize);
    document.removeEventListener("mousemove", this.onMouseMove);

    document.removeEventListener("touchmove", this.onTouchMove);
    document.removeEventListener("touchend", this.onEndResize);
    document.removeEventListener("touchcancel", this.onEndResize);
  }

  render() {
    const { className, children, style } = this.props;

    return (
      <SplitContext.Provider value={this.state}>
        <div className={className} style={style} ref={this.splitRef}>
          {children}
        </div>
      </SplitContext.Provider>
    );
  }

  private getSize(element: HTMLDivElement | null) {
    if (!element) {
      return -1;
    }
    const rect = element.getBoundingClientRect();
    if (this.state.split === "vertical") {
      return rect.width;
    }
    return rect.height;
  }
}
