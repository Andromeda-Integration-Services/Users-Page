using CAFMSystem.API.Models;

namespace CAFMSystem.API.Services
{
    /// <summary>
    /// Service for intelligent detection of service categories based on text analysis
    /// This is a completely new service that doesn't affect existing functionality
    /// </summary>
    public interface IServiceDetectionService
    {
        Task<List<ServiceDetectionResult>> AnalyzeTextAsync(string text);
        ServiceDetectionResult GetBestMatch(List<ServiceDetectionResult> results);
        Task<ServiceAnalysisResult> AnalyzeServiceRequestAsync(string description);
    }

    public class ServiceDetectionService : IServiceDetectionService
    {
        private readonly ILogger<ServiceDetectionService> _logger;

        // Keyword mappings for each service category
        private readonly Dictionary<TicketCategory, List<string>> _categoryKeywords = new()
        {
            {
                TicketCategory.Plumbing,
                new List<string>
                {
                    "water", "leak", "pipe", "drain", "faucet", "toilet", "plumbing", "sink", "shower", 
                    "bathroom", "tap", "flush", "clog", "overflow", "drip", "pressure", "hot water", 
                    "cold water", "valve", "sewage", "drainage", "basin", "bathtub"
                }
            },
            {
                TicketCategory.Electrical,
                new List<string>
                {
                    "light", "bulb", "electricity", "electrical", "power", "outlet", "wiring", "circuit", 
                    "switch", "breaker", "voltage", "current", "socket", "plug", "lamp", "lighting", 
                    "electric", "panel", "fuse", "short circuit", "blackout", "outage"
                }
            },
            {
                TicketCategory.HVAC,
                new List<string>
                {
                    "air conditioning", "heating", "ventilation", "ac", "hvac", "temperature", "thermostat", 
                    "fan", "vent", "air", "cool", "heat", "warm", "cold", "climate", "airflow", 
                    "filter", "duct", "furnace", "boiler", "radiator"
                }
            },
            {
                TicketCategory.Cleaning,
                new List<string>
                {
                    "cleaning", "janitor", "trash", "sanitize", "vacuum", "dirty", "spill", "waste", 
                    "garbage", "sweep", "mop", "dust", "stain", "mess", "hygiene", "disinfect", 
                    "restroom", "washroom", "carpet", "floor"
                }
            },
            {
                TicketCategory.Security,
                new List<string>
                {
                    "security", "access", "lock", "alarm", "surveillance", "camera", "door", "key", 
                    "badge", "card", "entry", "exit", "unauthorized", "breach", "monitor", "guard", 
                    "patrol", "safe", "theft", "break in"
                }
            },
            {
                TicketCategory.IT,
                new List<string>
                {
                    "computer", "network", "internet", "wifi", "printer", "software", "hardware", 
                    "system", "server", "phone", "telephone", "projector", "monitor", "keyboard", 
                    "mouse", "laptop", "desktop", "email", "password", "login"
                }
            },
            {
                TicketCategory.Maintenance,
                new List<string>
                {
                    "repair", "fix", "broken", "maintenance", "service", "replace", "install", 
                    "damaged", "worn", "defective", "malfunction", "issue", "problem", "fault", 
                    "equipment", "machinery", "tool", "device"
                }
            },
            {
                TicketCategory.Safety,
                new List<string>
                {
                    "safety", "hazard", "danger", "risk", "emergency", "fire", "smoke", "gas", 
                    "toxic", "slip", "fall", "injury", "accident", "warning", "caution", 
                    "evacuation", "first aid", "medical"
                }
            }
        };

        public ServiceDetectionService(ILogger<ServiceDetectionService> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Analyze input text and return potential service categories with confidence scores
        /// </summary>
        public async Task<List<ServiceDetectionResult>> AnalyzeTextAsync(string text)
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                return new List<ServiceDetectionResult>();
            }

            _logger.LogInformation("Analyzing text for service detection: {TextLength} characters", text.Length);

            var results = new List<ServiceDetectionResult>();
            var lowerText = text.ToLowerInvariant();

            foreach (var categoryMapping in _categoryKeywords)
            {
                var category = categoryMapping.Key;
                var keywords = categoryMapping.Value;
                
                var matchedKeywords = new List<string>();
                var totalScore = 0.0;

                foreach (var keyword in keywords)
                {
                    if (lowerText.Contains(keyword.ToLowerInvariant()))
                    {
                        matchedKeywords.Add(keyword);
                        // Score based on keyword length and frequency
                        var keywordScore = keyword.Length * 0.1 + 1.0;
                        totalScore += keywordScore;
                    }
                }

                if (matchedKeywords.Any())
                {
                    // Normalize confidence score (0-100)
                    var confidence = Math.Min(100, (totalScore / keywords.Count) * 100);
                    
                    results.Add(new ServiceDetectionResult
                    {
                        Category = category,
                        CategoryText = category.ToString(),
                        Confidence = confidence,
                        MatchedKeywords = matchedKeywords,
                        RelevanceScore = totalScore
                    });
                }
            }

            // Sort by confidence descending
            results = results.OrderByDescending(r => r.Confidence).ToList();

            _logger.LogInformation("Service detection completed. Found {Count} potential matches", results.Count);

            return await Task.FromResult(results);
        }

        /// <summary>
        /// Get the best matching category from analysis results
        /// </summary>
        public ServiceDetectionResult GetBestMatch(List<ServiceDetectionResult> results)
        {
            return results.FirstOrDefault() ?? new ServiceDetectionResult
            {
                Category = TicketCategory.General,
                CategoryText = "General",
                Confidence = 0,
                MatchedKeywords = new List<string>(),
                RelevanceScore = 0
            };
        }

        /// <summary>
        /// Analyze service request and return comprehensive analysis result
        /// </summary>
        public async Task<ServiceAnalysisResult> AnalyzeServiceRequestAsync(string description)
        {
            var detectionResults = await AnalyzeTextAsync(description);
            var bestMatch = GetBestMatch(detectionResults);

            return new ServiceAnalysisResult
            {
                DetectedCategory = bestMatch.Category,
                CategoryText = bestMatch.CategoryText,
                Confidence = bestMatch.Confidence,
                MatchedKeywords = bestMatch.MatchedKeywords,
                AllResults = detectionResults
            };
        }
    }

    /// <summary>
    /// Result of service detection analysis
    /// </summary>
    public class ServiceDetectionResult
    {
        public TicketCategory Category { get; set; }
        public string CategoryText { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public List<string> MatchedKeywords { get; set; } = new List<string>();
        public double RelevanceScore { get; set; }
    }

    /// <summary>
    /// Comprehensive analysis result for service requests
    /// </summary>
    public class ServiceAnalysisResult
    {
        public TicketCategory DetectedCategory { get; set; }
        public string CategoryText { get; set; } = string.Empty;
        public double Confidence { get; set; }
        public List<string> MatchedKeywords { get; set; } = new List<string>();
        public List<ServiceDetectionResult> AllResults { get; set; } = new List<ServiceDetectionResult>();
    }
}
