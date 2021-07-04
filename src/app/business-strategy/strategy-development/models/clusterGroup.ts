export interface MetadataClusterGroup {
  name: string;
  startIndex: number;
  numberOptions: number;
  bundles: Record<string, MetadataClusterGroupBundle>;
}

export interface MetadataClusterGroupBundle {
  // name==bundleerkennung
  // matches the key this metadata is stored under
  name: string;
  index: number;
}
