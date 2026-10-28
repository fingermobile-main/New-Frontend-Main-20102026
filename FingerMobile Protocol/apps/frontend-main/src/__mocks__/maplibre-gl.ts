// Mock for maplibre-gl in Jest tests
export class Map {
  on = jest.fn();
  remove = jest.fn();
  flyTo = jest.fn();
  addControl = jest.fn();
}

export class NavigationControl {}

export default {
  Map,
  NavigationControl,
};

