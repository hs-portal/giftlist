export default navigateWithBackParam = ({
  router,
  navigation,
  route,
  extraParams = {},
}) => {
  let navState = navigation.getState();
  let currentIndex = navState.index;
  let currentRouteName = navState.routes[currentIndex].key;

  router.push({
    pathname: route || "/root",
    params: { prevScreen: currentRouteName || "home", ...extraParams },
  });
};
