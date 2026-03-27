import type { Request, Response } from 'express';
import type { ExternalLinkCacheRepository } from '../../link/externalLinkCacheRepository';
import type { LinkAggregatorService, ProviderDescriptor } from '../../link/linkAggregatorService';
import type { ExternalLinkHealthCheckJob } from '../../jobs/externalLinkHealthCheckJob';

const descriptorsByEntityId: Record<string, ProviderDescriptor[]> = {
  panthera_tigris: [
    {
      provider: 'wikipedia',
      url: 'https://en.wikipedia.org/wiki/Tiger',
      fallbackSummary: 'Tiger species profile cached locally.',
    },
    {
      provider: 'gbif',
      url: 'https://api.gbif.org/v1/species/2435099',
      fallbackSummary: 'GBIF taxon profile cached locally.',
    },
    {
      provider: 'wikidata',
      url: 'https://www.wikidata.org/wiki/Q19939',
      fallbackSummary: 'Wikidata entity summary cached locally.',
    },
    {
      provider: 'col',
      url: 'https://api.catalogueoflife.org/nameusage/search?q=Panthera%20tigris',
      fallbackSummary: 'Catalogue of Life result cached locally.',
    },
  ],
};

export class ExternalLinksController {
  constructor(
    private readonly aggregatorService: LinkAggregatorService,
    private readonly cacheRepository: ExternalLinkCacheRepository,
    private readonly healthCheckJob: ExternalLinkHealthCheckJob,
  ) {}

  getExternalLinks = async (req: Request, res: Response): Promise<void> => {
    const entityId = req.params.entityId;
    const descriptors = descriptorsByEntityId[entityId] ?? [];

    // Frontend is required to use this aggregated response.
    const links = await this.aggregatorService.getExternalLinks(descriptors);
    res.json({ entityId, links });
  };

  getHealthStatus = async (_req: Request, res: Response): Promise<void> => {
    const cacheRows = await this.cacheRepository.findAll();
    const items = cacheRows.map((row) => this.aggregatorService.hydrateFromCache(row));
    res.json({ items });
  };

  triggerHealthRefresh = async (_req: Request, res: Response): Promise<void> => {
    await this.healthCheckJob.runOnce();
    res.status(202).json({ message: 'External link health refresh triggered.' });
  };
}
