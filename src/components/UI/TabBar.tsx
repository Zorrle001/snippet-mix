import styles from "@/styles/UI/TabBarStyles.module.scss";

type Props = {
    tabs: string[];
    activeTab: number;
    onNavigate: (tabID: number) => void;
};
export default function TabBar({ tabs, activeTab, onNavigate }: Props) {
    const tabElements = [];
    let tabID = 0;
    for (const tabTitle of tabs) {
        let elementTabID = tabID;
        tabElements.push(
            <button
                data-tabID={tabID}
                key={`tab-${tabID}`}
                className={activeTab === tabID ? styles.active : ""}
                onClick={() => {
                    onNavigate(elementTabID);
                }}
            >
                {tabTitle}
            </button>
        );
        tabID++;
    }

    return <nav id={styles.tabBar}>{tabElements}</nav>;
}
