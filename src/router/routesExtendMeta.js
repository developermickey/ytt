const routesExtendMeta = rootRoute => {
	if(rootRoute.children && rootRoute.children.length)
		for(let route of rootRoute.children) {
			route.meta = { ...rootRoute.meta };
			routesExtendMeta(route, rootRoute.meta)
		}
};

export default route => {
	routesExtendMeta(route, route.meta)
	return route;
};
