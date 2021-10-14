export default function () {
  return {
    userDetails: {},
    loadingLogin: false,
    //TODO: load card size from saved user prefs
    cardSize: 2,
    //TODO: more views, save views per folder
    views: [
      {
        id: 1,
        view: "card",
        enabled: true,
        default: true,
        icon: "mdi-view-comfy",
        label: "Card View",
      },
    ],
  };
}
