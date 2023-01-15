chrome.action.onClicked.addListener(handleActionClick);

async function handleActionClick() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    let groupId = tab.groupId;

    if (groupId == -1) {
        await chrome.action.setBadgeText({
            text: "X",
            tabId: tab.id,
        });
        await chrome.action.setTitle({
            tabId: tab.id,
            title: "The current tab must be in the group",
        });
        return;
    }

    await chrome.action.setBadgeText({
        text: "",
        tabId: tab.id,
    });
    await chrome.action.setTitle({
        tabId: tab.id,
        title: "Click to bookmark the current tab's group",
    });

    const groupInfo = await chrome.tabGroups.get(groupId);
    const groupName = groupInfo.title;

    const tabs = await chrome.tabs.query({ groupId: groupId });

    let tabsInfo = [];
    for (let tab of tabs) {
        tabsInfo.push({ title: tab.title, url: tab.url });
    }

    const folderInfo = await chrome.bookmarks.create({
        parentId: "1",
        title: groupName,
    });
    const folderId = folderInfo.id;

    for (let tab of tabsInfo) {
        await chrome.bookmarks.create({
            parentId: folderId,
            title: tab.title,
            url: tab.url,
        });
    }
}
