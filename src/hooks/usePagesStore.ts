import { create } from "zustand";

export type PagesStoreType = {
    legacy_collumns: number;
    set_legacy_Collumns: (collumns: number) => void;
    legacy_rows: number;
    set_legacy_Rows: (rows: number) => void;
    //
    pages: PageObjType[];
    setPages: (callback: (pages: PageObjType[]) => PageObjType[]) => void;
    activePage: number;
    setActivePage: (pageIndex: number) => void;
    editMode: boolean;
    setEditMode: (callback: (state: boolean) => boolean) => void;
};

export type PageObjType = {
    name: string;
    //id: number;
    collumns: number;
    rows: number;
    data: PageObjDataListType;
};

export type PageObjDataListType = {
    [row: number]: PageObjRowDataListType;
};

export type PageObjRowDataListType = {
    textInserts: PageObjRowDataTextType[];
    [collumn: number]: PageObjRowDataType;
};

export enum TextTypeEnum {
    H1 = "H1",
    H2 = "H2",
    H3 = "H3",
    Label = "Label",
}

export type PageObjRowDataTextType = {
    type: TextTypeEnum;
    text: string;
};

export enum CardEnum {
    SNIPPET = "snippet",
    GROUP = "group",
}

export type PageObjRowDataType = {
    type: CardEnum;
    id: number;
};

export const fallbackPage = {
    name: "Page",
    collumns: 5,
    rows: 3,
    data: {},
};

export const usePagesStore = create<PagesStoreType>((set, get) => ({
    legacy_collumns: 5,
    set_legacy_Collumns: (collumns) => {
        set({ legacy_collumns: collumns });
    },
    legacy_rows: 3,
    set_legacy_Rows: (rows) => {
        set({ legacy_rows: rows });
    },
    //
    pages: [],
    setPages: (callback) => {
        // CHECKING THAT ACTIVE PAGE IS ALWAYS DEFINED
        const newPages = callback(get().pages);
        if (newPages.length == 0) {
            newPages.push(structuredClone(fallbackPage));
            set({ pages: newPages, activePage: 0 });
        } else if (get().activePage > newPages.length - 1) {
            set({ pages: newPages, activePage: newPages.length - 1 });
        } else {
            set({ pages: newPages });
        }
    },
    activePage: 0,
    setActivePage: (page) => set({ activePage: page }),
    editMode: false,
    setEditMode: (callback) => set({ editMode: callback(get().editMode) }),
}));
