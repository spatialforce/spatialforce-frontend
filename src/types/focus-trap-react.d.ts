declare module 'focus-trap-react' {
    import { ComponentType, ReactNode } from 'react';
    
    interface FocusTrapProps {
      children: ReactNode;
      active?: boolean;
      paused?: boolean;
      focusTrapOptions?: any;
    }
    
    const FocusTrap: ComponentType<FocusTrapProps>;
    export default FocusTrap;
  }