import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useSongsListStore = create(
    devtools((set) => ({
        lastUpdated: Date.now(), // 변경 시점 기록
        notifyUpdate: () =>
            set({
                lastUpdated: Date.now(),
            }),
    }))
);
