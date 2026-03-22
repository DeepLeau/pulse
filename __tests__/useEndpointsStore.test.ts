import { renderHook, act } from '@testing-library/react';
import { useEndpointsStore } from '@/hooks/useEndpointsStore';

describe('useEndpointsStore', () => {
  beforeEach(() => {
    // Each test gets fresh state via renderHook
  });

  describe('initial state', () => {
    it('should return 10 initial endpoints', () => {
      const { result } = renderHook(() => useEndpointsStore());
      expect(result.current.endpoints).toHaveLength(10);
    });

    it('should include endpoints with healthy, degraded, and down statuses', () => {
      const { result } = renderHook(() => useEndpointsStore());
      const statuses = result.current.endpoints.map((e) => e.status);
      expect(statuses).toContain('healthy');
      expect(statuses).toContain('degraded');
      expect(statuses).toContain('down');
    });
  });

  describe('addEndpoint', () => {
    it('should add a new endpoint at the beginning of the list', () => {
      const { result } = renderHook(() => useEndpointsStore());
      const initialCount = result.current.endpoints.length;

      act(() => {
        result.current.addEndpoint({
          name: 'New Service',
          url: 'https://api.new.com',
          method: 'GET',
          interval: '60s',
          timeout: '10s',
        });
      });

      expect(result.current.endpoints).toHaveLength(initialCount + 1);
      expect(result.current.endpoints[0].name).toBe('New Service');
    });

    it('should strip protocol from URL when adding endpoint', () => {
      const { result } = renderHook(() => useEndpointsStore());

      act(() => {
        result.current.addEndpoint({
          name: 'Test Service',
          url: 'https://api.test.com/endpoint',
          method: 'GET',
          interval: '60s',
          timeout: '10s',
        });
      });

      expect(result.current.endpoints[0].url).toBe('api.test.com/endpoint');
    });

    it('should strip http protocol as well', () => {
      const { result } = renderHook(() => useEndpointsStore());

      act(() => {
        result.current.addEndpoint({
          name: 'HTTP Service',
          url: 'http://api.http.com',
          method: 'POST',
          interval: '30s',
          timeout: '5s',
        });
      });

      expect(result.current.endpoints[0].url).toBe('api.http.com');
    });

    it('should set new endpoint status to healthy with 100% uptime', () => {
      const { result } = renderHook(() => useEndpointsStore());

      act(() => {
        result.current.addEndpoint({
          name: 'Fresh Endpoint',
          url: 'https://fresh.com',
          method: 'GET',
          interval: '60s',
          timeout: '10s',
        });
      });

      const newEndpoint = result.current.endpoints[0];
      expect(newEndpoint.status).toBe('healthy');
      expect(newEndpoint.uptime).toBe(100);
      expect(newEndpoint.lastCheck).toBe('Just now');
    });

    it('should generate unique ID for new endpoint', () => {
      const { result } = renderHook(() => useEndpointsStore());
      const initialIds = result.current.endpoints.map((e) => e.id);

      act(() => {
        result.current.addEndpoint({
          name: 'Unique Test',
          url: 'https://unique.com',
          method: 'GET',
          interval: '60s',
          timeout: '10s',
        });
      });

      const newId = result.current.endpoints[0].id;
      expect(newId).toMatch(/^ep-\d+-[a-z0-9]+$/);
      expect(initialIds).not.toContain(newId);
    });
  });

  describe('deleteEndpoint', () => {
    it('should remove endpoint from the list', () => {
      const { result } = renderHook(() => useEndpointsStore());
      const targetId = result.current.endpoints[0].id;

      act(() => {
        result.current.deleteEndpoint(targetId);
      });

      const remaining = result.current.endpoints.find((e) => e.id === targetId);
      expect(remaining).toBeUndefined();
    });

    it('should reduce list length by 1', () => {
      const { result } = renderHook(() => useEndpointsStore());
      const initialLength = result.current.endpoints.length;

      act(() => {
        result.current.deleteEndpoint(result.current.endpoints[0].id);
      });

      expect(result.current.endpoints).toHaveLength(initialLength - 1);
    });

    it('should not throw when deleting non-existent ID', () => {
      const { result } = renderHook(() => useEndpointsStore());

      expect(() => {
        act(() => {
          result.current.deleteEndpoint('non-existent-id');
        });
      }).not.toThrow();
    });

    it('should not modify other endpoints', () => {
      const { result } = renderHook(() => useEndpointsStore());
      const secondEndpoint = result.current.endpoints[1];
      const thirdEndpoint = result.current.endpoints[2];

      act(() => {
        result.current.deleteEndpoint(result.current.endpoints[0].id);
      });

      expect(result.current.endpoints[0].id).toBe(secondEndpoint.id);
      expect(result.current.endpoints[1].id).toBe(thirdEndpoint.id);
    });
  });

  describe('updateEndpoint', () => {
    it('should update endpoint name and URL', () => {
      const { result } = renderHook(() => useEndpointsStore());
      const targetId = result.current.endpoints[0].id;

      act(() => {
        result.current.updateEndpoint(targetId, {
          name: 'Updated Name',
          url: 'https://updated.url.com/path',
          method: 'POST',
          interval: '30s',
          timeout: '5s',
        });
      });

      const updated = result.current.endpoints.find((e) => e.id === targetId);
      expect(updated?.name).toBe('Updated Name');
      expect(updated?.url).toBe('updated.url.com/path');
    });

    it('should strip protocol from updated URL', () => {
      const { result } = renderHook(() => useEndpointsStore());
      const targetId = result.current.endpoints[0].id;

      act(() => {
        result.current.updateEndpoint(targetId, {
          name: 'Test',
          url: 'http://stripped.com',
          method: 'GET',
          interval: '60s',
          timeout: '10s',
        });
      });

      const updated = result.current.endpoints.find((e) => e.id === targetId);
      expect(updated?.url).toBe('stripped.com');
    });

    it('should preserve other endpoint properties', () => {
      const { result } = renderHook(() => useEndpointsStore());
      const original = result.current.endpoints[0];

      act(() => {
        result.current.updateEndpoint(original.id, {
          name: 'Changed',
          url: 'https://changed.com',
          method: 'GET',
          interval: '60s',
          timeout: '10s',
        });
      });

      const updated = result.current.endpoints.find((e) => e.id === original.id);
      expect(updated?.id).toBe(original.id);
      expect(updated?.status).toBe(original.status);
      expect(updated?.uptime).toBe(original.uptime);
    });

    it('should not throw when updating non-existent endpoint', () => {
      const { result } = renderHook(() => useEndpointsStore());

      expect(() => {
        act(() => {
          result.current.updateEndpoint('non-existent', {
            name: 'Test',
            url: 'https://test.com',
            method: 'GET',
            interval: '60s',
            timeout: '10s',
          });
        });
      }).not.toThrow();
    });
  });
});
