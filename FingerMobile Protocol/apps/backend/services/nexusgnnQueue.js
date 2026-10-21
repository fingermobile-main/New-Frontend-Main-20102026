/**
 * NexusGNN Asynchronous Job Queue & Worker
 * Handles background embedding recomputation, batch lifecycle updates, and task tracking
 */

const logger = require('../utils/logger');
const gnnEngine = require('./gnnEngine');

class NexusGNNQueue {
  constructor() {
    this.jobs = new Map();
    this.isProcessing = false;
  }

  /**
   * Enqueue a new embedding update job
   * @param {string[]} [nodeIds] Optional node IDs to restrict update to
   * @param {number} [batchSize=100] Batch chunk size
   * @returns {object} Job status record
   */
  enqueueEmbeddingUpdate(nodeIds = null, batchSize = 100) {
    const jobId = `emb_job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const job = {
      jobId,
      type: 'EMBEDDING_RECOMPUTATION',
      status: 'queued',
      progress: 0,
      targetNodesCount: nodeIds ? nodeIds.length : 'all',
      batchSize,
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      durationMs: null,
      error: null,
      result: null
    };

    this.jobs.set(jobId, job);
    logger.info(`NexusGNN Job enqueued: ${jobId}`);

    // Trigger asynchronous worker process in background without blocking
    if (process.env.NODE_ENV !== 'test') {
      setImmediate(() => {
        this.processNextJob(jobId, nodeIds).catch(err => {
          logger.error(`Error executing job ${jobId}:`, err);
        });
      });
    }

    return job;
  }

  /**
   * Worker executing the embedding job
   * @param {string} jobId 
   * @param {string[]} nodeIds 
   */
  async processNextJob(jobId, nodeIds) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'processing';
    job.startedAt = new Date().toISOString();
    job.progress = 25;

    try {
      logger.info(`Starting execution of NexusGNN job ${jobId}...`);
      job.progress = 50;

      const result = await gnnEngine.recomputeAllEmbeddings(nodeIds);

      job.progress = 100;
      job.status = 'completed';
      job.completedAt = new Date().toISOString();
      job.durationMs = result.durationMs;
      job.result = {
        nodesUpdated: result.updatedCount,
        dimension: 256,
        model: 'PinSage-MetaGNN-Fusion'
      };

      logger.info(`NexusGNN job ${jobId} completed successfully in ${result.durationMs}ms`);
    } catch (error) {
      job.status = 'failed';
      job.completedAt = new Date().toISOString();
      job.error = error.message;
      logger.error(`NexusGNN job ${jobId} failed:`, error);
    }
  }

  /**
   * Get specific job details
   * @param {string} jobId 
   * @returns {object|null}
   */
  getJob(jobId) {
    return this.jobs.get(jobId) || null;
  }

  /**
   * List all jobs (sorted by most recent)
   * @param {number} [limit=20]
   * @returns {object[]}
   */
  listJobs(limit = 20) {
    return Array.from(this.jobs.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}

module.exports = new NexusGNNQueue();
