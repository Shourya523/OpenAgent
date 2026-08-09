"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type DnDItem = {
    type: string;
    label: string;
    nodeType?: string;
};

type DnDContextType = [DnDItem | null, React.Dispatch<React.SetStateAction<DnDItem | null>>];

const DnDContext = createContext<DnDContextType>([null, () => {}]);

export const DnDProvider = ({ children }: { children: ReactNode }) => {
    const [dndItem, setDndItem] = useState<DnDItem | null>(null);

    return (
        <DnDContext.Provider value={[dndItem, setDndItem]}>
            {children}
        </DnDContext.Provider>
    );
};

export default DnDContext;

export const useDnD = () => {
    return useContext(DnDContext);
};
