# `jbrowse-plugin-multilevel-linear-view`

> JBrowse 2 plugin that adds a linear genome view that can show multiple zoom levels.

## Usage

## Terminology

`anchor`: The "anchor" view is the central control for all sub views. Your workflow should be based around the context of the anchor view. The anchor view will always be the lowest zoom level of all views.

`overview`: The "overview" view is the highest level view of the region that cannot be zoomed in or out.

`sub view`: The "sub" views are all other views that support the anchor and overview. They will always be between the anchor and the
overview.

`linked`: The status of the multi-level linear view when views will move and behave together based on actions performed on the anchor view.

`ascending`: The views ordered such that the 'overview' is at the top level of the cascading multi-level of views, and the 'anchor' is at the bottom.

`descending`: The views ordered such that the 'anchor' is at the top level of the cascading multi-level of views, and the 'overview' is at the bottom.

## Control options

### Toggle linked views

This button will toggle whether the views are linked together. When the views are linked together, operations will occur simultaneously based on operations performed on the 'anchor'.

### Align views

Linked or unlinked, this button will realign all sub views to the anchor view. That is, the centre of all sub views will be aligned to the centre of the anchor view.

### Reset sub view zoom levels

Linked or unlinked, this button will bring all sub views within one zoom level of the anchor view, and subsequently within one zoom level of each other.

### Zoom in and zoom out

These buttons found in the 'mini menu' of each view will zoom that view in and out.

All zoom actions will attempt to maintain a cascading relationship between the views. For example, zooming in on a view on a descending multilevel linear view that has a neighbour below it, will also zoom in that neighbour to maintain the cascading relationship.

## Screenshots
