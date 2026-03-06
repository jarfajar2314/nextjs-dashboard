export type ResourceType = {
	id: string;
	code: string;
	name: string;
};

export type ScheduleResource = {
	id: string;
	name: string;
	resourceTypeId: string;
	resourceType: ResourceType;
	isActive: boolean;
	code?: string | null;
	color?: string | null;
	userId?: string;
	user?: any;
};
