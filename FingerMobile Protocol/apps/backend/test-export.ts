import { Request } from 'express';
class TestExport {
  hello() { return 'world'; }
}
export = new TestExport();
