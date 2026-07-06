import { InputChannelDataCollection } from "@/types/InputChannelTypes";
import { SendBusDataCollection } from "@/types/SendBusTypes";
import { produce } from "immer";
import { create } from "zustand";

export type MixerMergeStore_v2_Type = {
    inputChannelDataCollections: Map<string, InputChannelDataCollection>;
    sendBusDataCollections: Map<string, SendBusDataCollection>;
    getInputChannelDataCollection: (
        uuid: string
    ) => InputChannelDataCollection | undefined;
    getSendBusDataCollection: (
        uuid: string
    ) => SendBusDataCollection | undefined;
    setInputChannelDataCollection: (
        uuid: string,
        inputChannelDataCollection: InputChannelDataCollection
    ) => void;
    setSendBusDataCollection: (
        uuid: string,
        sendBusDataCollection: SendBusDataCollection
    ) => void;
    immerUpdateInputChannelDataCollection: (
        uuid: string,
        updater: (draftCollection: InputChannelDataCollection) => void
    ) => void;
    immerUpdateSendBusDataCollection: (
        uuid: string,
        updater: (draftCollection: SendBusDataCollection) => void
    ) => void;
    mergeInputChannelDataCollection: (
        uuid: string,
        inputChannelDataCollectionPartial: Partial<InputChannelDataCollection>
    ) => void;
    mergeSendBusDataCollection: (
        uuid: string,
        sendBusDataCollectionPartial: Partial<SendBusDataCollection>
    ) => void;
    removeMixer: (uuid: string) => void;
};

export const useMixerMergeStore_v2 = create<MixerMergeStore_v2_Type>(
    (set, get) => ({
        inputChannelDataCollections: new Map<
            string,
            InputChannelDataCollection
        >(),
        sendBusDataCollections: new Map<string, SendBusDataCollection>(),
        getInputChannelDataCollection: (uuid) =>
            get().inputChannelDataCollections.get(uuid),
        getSendBusDataCollection: (uuid) =>
            get().sendBusDataCollections.get(uuid),
        setInputChannelDataCollection: (uuid, inputChannelDataCollection) => {
            const prevMap = get().inputChannelDataCollections;
            const updatedMap = new Map(prevMap).set(
                uuid,
                inputChannelDataCollection
            );
            set({ inputChannelDataCollections: updatedMap });
        },
        setSendBusDataCollection: (uuid, sendBusDataCollection) => {
            const prevMap = get().sendBusDataCollections;
            const updatedMap = new Map(prevMap).set(
                uuid,
                sendBusDataCollection
            );
            set({ sendBusDataCollections: updatedMap });
        },
        removeMixer: (uuid) => {
            const map1 = new Map(get().inputChannelDataCollections);
            map1.delete(uuid);
            const map2 = new Map(get().sendBusDataCollections);
            map2.delete(uuid);
            set({
                inputChannelDataCollections: map1,
                sendBusDataCollections: map2,
            });
        },
        immerUpdateInputChannelDataCollection: (uuid, updater) => {
            const baseCollection = get().getInputChannelDataCollection(uuid);

            if (!baseCollection) {
                throw new Error(
                    "No InputChannelDataCollection found for uuid: " + uuid
                );
            }

            const newCollection = produce(baseCollection, updater);
            get().setInputChannelDataCollection(uuid, newCollection);
        },
        immerUpdateSendBusDataCollection: (uuid, updater) => {
            const baseCollection = get().getSendBusDataCollection(uuid);

            if (!baseCollection) {
                throw new Error(
                    "No SendBusDataCollection found for uuid: " + uuid
                );
            }

            const newCollection = produce(baseCollection, updater);
            get().setSendBusDataCollection(uuid, newCollection);
        },
        mergeInputChannelDataCollection: (
            uuid,
            inputChannelDataCollectionPartial
        ) => {
            console.log("TRY TO MERGE");
            const baseCollection = get().getInputChannelDataCollection(uuid);

            if (!baseCollection) {
                throw new Error(
                    "No InputChannelDataCollection found for uuid: " + uuid
                );
            }

            const newCollection = lodash.merge(
                {},
                baseCollection,
                inputChannelDataCollectionPartial
            );

            get().setInputChannelDataCollection(uuid, newCollection);
        },
        mergeSendBusDataCollection: (uuid, sendBusDataCollectionPartial) => {
            const baseCollection = get().getSendBusDataCollection(uuid);

            if (!baseCollection) {
                throw new Error(
                    "No SendBusDataCollection found for uuid: " + uuid
                );
            }

            const newCollection = lodash.merge(
                {},
                baseCollection,
                sendBusDataCollectionPartial
            );

            get().setSendBusDataCollection(uuid, newCollection);
        },
    })
);
