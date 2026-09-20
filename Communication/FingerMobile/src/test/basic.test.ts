import { CommunicationService } from '../services/communicationService';

describe('Communication Service', () => {
  test('should create a communication', async () => {
    const communication = await CommunicationService.createCommunication({
      title: 'Test Announcement',
      content: 'This is a test announcement',
      type: 'announcement',
      priority: 'high',
      targetAudience: 'all',
      createdBy: 'test-user-id'
    });

    expect(communication.title).toBe('Test Announcement');
    expect(communication.content).toBe('This is a test announcement');
    expect(communication.type).toBe('announcement');
    expect(communication.priority).toBe('high');
    expect(communication.targetAudience).toBe('all');
    expect(communication.createdBy).toBe('test-user-id');
  });

  test('should get communications with pagination', async () => {
    const result = await CommunicationService.getCommunications({
      page: 1,
      limit: 10
    });

    expect(result.data).toBeDefined();
    expect(result.pagination).toBeDefined();
    expect(result.pagination.page).toBe(1);
    expect(result.pagination.limit).toBe(10);
  });

  test('should update a communication', async () => {
    // First create a communication
    const newComm = await CommunicationService.createCommunication({
      title: 'Original Title',
      content: 'Original Content',
      type: 'test',
      priority: 'low',
      targetAudience: 'all',
      createdBy: 'test-user-id'
    });

    // Then update it
    const updatedComm = await CommunicationService.updateCommunication(newComm.id, {
      title: 'Updated Title',
      content: 'Updated Content'
    });

    expect(updatedComm?.title).toBe('Updated Title');
    expect(updatedComm?.content).toBe('Updated Content');
    expect(updatedComm?.type).toBe('test'); // Added type check
    expect(updatedComm?.priority).toBe('low'); // Added priority check
    expect(updatedComm?.targetAudience).toBe('all'); // Added targetAudience check
  });

  test('should delete a communication', async () => {
    // First create a communication
    const newComm = await CommunicationService.createCommunication({
      title: 'To Be Deleted',
      content: 'This will be deleted',
      type: 'test',
      priority: 'low',
      targetAudience: 'all',
      createdBy: 'test-user-id'
    });

    // Then delete it
    const deleted = await CommunicationService.deleteCommunication(newComm.id);

    expect(deleted).toBe(true);
  });
});