import { notFound } from "next/navigation"
import BlogDetail from "@/components/blog/blog-detail"
import { Metadata } from "next"

// 这里可以从数据库或API获取博客数据
const blogPosts = [
  {
    id: "1",
    title: "匠码社区项目中的消息队列实践",
    summary: "在匠码社区项目中，我负责实现了基于RabbitMQ的消息队列系统，用于处理用户评论、点赞、收藏等异步操作。本文分享在实际项目中应用消息队列的经验和遇到的问题。",
    date: "2025-03-15",
    readTime: "12分钟",
    tags: ["RabbitMQ", "消息队列", "Java", "Spring Boot", "异步处理"],
    category: "后端开发",
    views: 1250,
    likes: 89,
    featured: true,
    slug: "rabbitmq-practice-in-paicoding",
    content: `
# 匠码社区项目中的消息队列实践

在匠码社区项目中，我负责实现了基于RabbitMQ的消息队列系统，用于处理用户评论、点赞、收藏等异步操作。通过消息队列，我们成功解决了高并发场景下的性能问题，提升了用户体验。

## 项目背景

匠码是一个面向开发者的技术社区平台，用户可以进行文章发布、评论、点赞、收藏等操作。在项目初期，这些操作都是同步处理的，导致用户操作响应时间较长，特别是在高并发场景下。

## 技术选型

选择RabbitMQ作为消息队列的原因：
- 支持多种消息模式（点对点、发布订阅、路由等）
- 提供完善的管理界面
- 支持消息持久化
- 社区活跃，文档完善

## 实现方案

### 1. 消息队列配置

\`\`\`java
@Configuration
public class RabbitMQConfig {
    
    public static final String COMMENT_QUEUE = "comment.queue";
    public static final String LIKE_QUEUE = "like.queue";
    public static final String COLLECT_QUEUE = "collect.queue";
    public static final String NOTIFICATION_QUEUE = "notification.queue";
    
    @Bean
    public Queue commentQueue() {
        return new Queue(COMMENT_QUEUE, true);
    }
    
    @Bean
    public Queue likeQueue() {
        return new Queue(LIKE_QUEUE, true);
    }
    
    @Bean
    public Queue collectQueue() {
        return new Queue(COLLECT_QUEUE, true);
    }
    
    @Bean
    public Queue notificationQueue() {
        return new Queue(NOTIFICATION_QUEUE, true);
    }
}
\`\`\`

### 2. 消息发送

\`\`\`java
@Service
public class MessageService {
    
    @Autowired
    private RabbitTemplate rabbitTemplate;
    
    public void sendCommentMessage(CommentMessage message) {
        rabbitTemplate.convertAndSend(COMMENT_QUEUE, message);
    }
    
    public void sendLikeMessage(LikeMessage message) {
        rabbitTemplate.convertAndSend(LIKE_QUEUE, message);
    }
    
    public void sendCollectMessage(CollectMessage message) {
        rabbitTemplate.convertAndSend(COLLECT_QUEUE, message);
    }
}
\`\`\`

### 3. 消息消费

\`\`\`java
@Component
public class CommentMessageConsumer {
    
    @Autowired
    private CommentService commentService;
    @Autowired
    private NotificationService notificationService;
    
    @RabbitListener(queues = COMMENT_QUEUE)
    public void handleCommentMessage(CommentMessage message) {
        try {
            // 处理评论逻辑
            commentService.processComment(message);
            
            // 发送通知
            notificationService.sendCommentNotification(message);
            
            log.info("评论消息处理成功: {}", message.getCommentId());
        } catch (Exception e) {
            log.error("评论消息处理失败: {}", message.getCommentId(), e);
        }
    }
}
\`\`\`

## 遇到的问题和解决方案

### 1. 消息丢失问题

**问题**：在系统重启时，未确认的消息会丢失。

**解决方案**：
- 启用消息持久化
- 使用手动确认模式
- 实现消息重试机制

\`\`\`java
@RabbitListener(queues = COMMENT_QUEUE)
public void handleCommentMessage(CommentMessage message, Channel channel, 
                               @Header(AmqpHeaders.DELIVERY_TAG) long deliveryTag) {
    try {
        // 处理业务逻辑
        commentService.processComment(message);
        
        // 手动确认消息
        channel.basicAck(deliveryTag, false);
    } catch (Exception e) {
        // 消息处理失败，拒绝消息并重新入队
        channel.basicNack(deliveryTag, false, true);
        log.error("消息处理失败，已重新入队: {}", message.getCommentId(), e);
    }
}
\`\`\`

### 2. 消息重复消费问题

**问题**：由于网络问题或系统异常，可能导致消息重复消费。

**解决方案**：
- 实现幂等性处理
- 使用Redis记录已处理的消息ID

\`\`\`java
@Service
public class CommentService {
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    public void processComment(CommentMessage message) {
        String key = "comment:processed:" + message.getCommentId();
        
        // 检查是否已处理
        if (Boolean.TRUE.equals(redisTemplate.hasKey(key))) {
            log.info("评论已处理，跳过: {}", message.getCommentId());
            return;
        }
        
        // 处理评论逻辑
        // ...
        
        // 标记为已处理，设置过期时间
        redisTemplate.opsForValue().set(key, "1", Duration.ofHours(24));
    }
}
\`\`\`

## 性能优化

### 1. 批量处理

对于高频操作如点赞，采用批量处理方式：

\`\`\`java
@Component
public class LikeMessageConsumer {
    
    private final List<LikeMessage> messageBuffer = new ArrayList<>();
    private final int batchSize = 100;
    
    @Scheduled(fixedDelay = 5000) // 每5秒处理一次
    public void processBatch() {
        if (messageBuffer.isEmpty()) {
            return;
        }
        
        List<LikeMessage> batch = new ArrayList<>(messageBuffer);
        messageBuffer.clear();
        
        // 批量处理点赞逻辑
        likeService.processBatchLike(batch);
    }
    
    @RabbitListener(queues = LIKE_QUEUE)
    public void handleLikeMessage(LikeMessage message) {
        messageBuffer.add(message);
        
        if (messageBuffer.size() >= batchSize) {
            processBatch();
        }
    }
}
\`\`\`

### 2. 连接池优化

配置RabbitMQ连接池参数：

\`\`\`yaml
spring:
  rabbitmq:
    host: localhost
    port: 5672
    username: admin
    password: admin
    virtual-host: /
    connection-timeout: 15000
    requested-heart-beat: 30
    publisher-confirm-type: correlated
    publisher-returns: true
    template:
      mandatory: true
    listener:
      simple:
        acknowledge-mode: manual
        prefetch: 10
        concurrency: 5
        max-concurrency: 10
\`\`\`

## 监控和运维

### 1. 消息监控

使用RabbitMQ Management插件监控队列状态：

\`\`\`java
@Component
public class RabbitMQMonitor {
    
    @Scheduled(fixedRate = 60000) // 每分钟检查一次
    public void monitorQueues() {
        // 检查队列长度
        // 检查消费者状态
        // 发送告警信息
    }
}
\`\`\`

### 2. 日志记录

详细记录消息处理日志，便于问题排查：

\`\`\`java
@Aspect
@Component
public class MessageLogAspect {
    
    @Around("@annotation(org.springframework.amqp.rabbit.annotation.RabbitListener)")
    public Object logMessageProcessing(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        Object result = null;
        
        try {
            result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            log.info("消息处理成功，耗时: {}ms", duration);
        } catch (Exception e) {
            log.error("消息处理失败", e);
            throw e;
        }
        
        return result;
    }
}
\`\`\`

## 总结

通过引入RabbitMQ消息队列，匠码社区项目的用户体验得到了显著提升：

- **响应时间**：用户操作响应时间从平均3秒降低到500ms以内
- **系统稳定性**：异步处理避免了同步操作导致的系统阻塞
- **可扩展性**：消息队列为后续功能扩展提供了良好的基础

在实际项目中，消息队列的选择和配置需要根据具体业务场景进行调整，同时要注意消息的可靠性、幂等性等问题。
    `
  },
  {
    id: "2",
    title: "线上便利店项目中的缓存架构优化",
    summary: "在线上便利店项目中，我负责设计了多级缓存架构，解决了热门商品数据的高并发访问问题。本文分享缓存设计思路和实现细节。",
    date: "2025-07-10",
    readTime: "15分钟",
    tags: ["Redis", "Caffeine", "缓存架构", "高并发", "Java"],
    category: "后端开发",
    views: 1150,
    likes: 95,
    featured: true,
    slug: "cache-architecture-optimization",
    content: `
# 线上便利店项目中的缓存架构优化

在线上便利店项目中，我负责设计了基于Caffeine+Redis的多级缓存架构，有效解决了热门商品数据的高并发访问问题。本文分享缓存设计思路、实现细节和遇到的问题。

## 项目背景

线上便利店项目为校园师生提供购物平台，包括商品浏览、购物车、订单管理等功能。在项目初期，商品信息直接从数据库查询，导致热门商品页面加载缓慢，用户体验不佳。

## 缓存架构设计

### 1. 多级缓存架构

采用本地缓存+分布式缓存的两级架构：

\`\`\`
用户请求 → Caffeine本地缓存 → Redis分布式缓存 → MySQL数据库
\`\`\`

### 2. 缓存策略

- **Caffeine本地缓存**：存储热点数据，响应时间<1ms
- **Redis分布式缓存**：存储次热点数据，响应时间<10ms
- **MySQL数据库**：存储全量数据，作为数据源

## 技术实现

### 1. Caffeine配置

\`\`\`java
@Configuration
public class CaffeineConfig {
    
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager();
        
        // 商品缓存配置
        cacheManager.registerCustomCache("products", Caffeine.newBuilder()
            .maximumSize(1000)
            .expireAfterWrite(Duration.ofMinutes(30))
            .expireAfterAccess(Duration.ofMinutes(10))
            .recordStats()
            .build());
        
        // 分类缓存配置
        cacheManager.registerCustomCache("categories", Caffeine.newBuilder()
            .maximumSize(100)
            .expireAfterWrite(Duration.ofHours(2))
            .recordStats()
            .build());
        
        return cacheManager;
    }
}
\`\`\`

### 2. Redis配置

\`\`\`java
@Configuration
public class RedisConfig {
    
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(factory);
        
        // 设置序列化器
        Jackson2JsonRedisSerializer<Object> serializer = new Jackson2JsonRedisSerializer<>(Object.class);
        ObjectMapper mapper = new ObjectMapper();
        mapper.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        mapper.activateDefaultTyping(LaissezFaireSubTypeValidator.instance, 
                                   ObjectMapper.DefaultTyping.NON_FINAL, JsonTypeInfo.As.PROPERTY);
        serializer.setObjectMapper(mapper);
        
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(serializer);
        template.setHashKeySerializer(new StringRedisSerializer());
        template.setHashValueSerializer(serializer);
        
        return template;
    }
}
\`\`\`

### 3. 缓存服务实现

\`\`\`java
@Service
public class ProductCacheService {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Cacheable(value = "products", key = "#productId")
    public Product getProduct(Long productId) {
        // 先从Redis获取
        Product product = getFromRedis(productId);
        if (product != null) {
            return product;
        }
        
        // Redis没有，从数据库获取
        product = productService.getProductById(productId);
        if (product != null) {
            // 写入Redis
            setToRedis(productId, product);
        }
        
        return product;
    }
    
    private Product getFromRedis(Long productId) {
        String key = "product:" + productId;
        return (Product) redisTemplate.opsForValue().get(key);
    }
    
    private void setToRedis(Long productId, Product product) {
        String key = "product:" + productId;
        redisTemplate.opsForValue().set(key, product, Duration.ofHours(1));
    }
    
    @CacheEvict(value = "products", key = "#productId")
    public void evictProduct(Long productId) {
        // 清除Redis缓存
        String key = "product:" + productId;
        redisTemplate.delete(key);
    }
}
\`\`\`

## 缓存一致性保证

### 1. 先更新数据库，再删除缓存

\`\`\`java
@Service
public class ProductService {
    
    @Autowired
    private ProductCacheService cacheService;
    
    @Transactional
    public void updateProduct(Product product) {
        // 1. 更新数据库
        productMapper.updateById(product);
        
        // 2. 删除缓存
        cacheService.evictProduct(product.getId());
        
        // 3. 发送消息通知其他服务清除缓存
        messageService.sendCacheEvictMessage(product.getId());
    }
}
\`\`\`

### 2. 缓存预热

\`\`\`java
@Component
public class CacheWarmUpService {
    
    @Autowired
    private ProductService productService;
    
    @Autowired
    private ProductCacheService cacheService;
    
    @PostConstruct
    public void warmUpCache() {
        // 获取热门商品列表
        List<Long> hotProductIds = productService.getHotProductIds();
        
        for (Long productId : hotProductIds) {
            try {
                // 预热缓存
                cacheService.getProduct(productId);
                log.info("商品缓存预热成功: {}", productId);
            } catch (Exception e) {
                log.error("商品缓存预热失败: {}", productId, e);
            }
        }
    }
}
\`\`\`

## 性能优化

### 1. 批量操作

对于商品列表查询，使用批量操作提升性能：

\`\`\`java
@Service
public class ProductListService {
    
    public List<Product> getProductList(List<Long> productIds) {
        // 批量从缓存获取
        List<Product> products = new ArrayList<>();
        List<Long> missIds = new ArrayList<>();
        
        for (Long productId : productIds) {
            Product product = cacheService.getProduct(productId);
            if (product != null) {
                products.add(product);
            } else {
                missIds.add(productId);
            }
        }
        
        // 批量从数据库获取缺失的数据
        if (!missIds.isEmpty()) {
            List<Product> dbProducts = productService.getProductsByIds(missIds);
            products.addAll(dbProducts);
        }
        
        return products;
    }
}
\`\`\`

### 2. 异步更新

对于非关键数据，采用异步更新策略：

\`\`\`java
@Service
public class ProductStatisticsService {
    
    @Async
    public void updateProductViewCount(Long productId) {
        String key = "product:view:" + productId;
        redisTemplate.opsForValue().increment(key);
        
        // 定期同步到数据库
        Long viewCount = (Long) redisTemplate.opsForValue().get(key);
        if (viewCount != null && viewCount % 100 == 0) {
            productService.updateViewCount(productId, viewCount);
        }
    }
}
\`\`\`

## 监控和运维

### 1. 缓存命中率监控

\`\`\`java
@Component
public class CacheMonitor {
    
    @Autowired
    private CacheManager cacheManager;
    
    @Scheduled(fixedRate = 60000)
    public void monitorCacheStats() {
        CaffeineCacheManager caffeineCacheManager = (CaffeineCacheManager) cacheManager;
        
        caffeineCacheManager.getCacheNames().forEach(cacheName -> {
            Cache cache = caffeineCacheManager.getCache(cacheName);
            if (cache instanceof CaffeineCache) {
                CaffeineCache caffeineCache = (CaffeineCache) cache;
                com.github.benmanes.caffeine.cache.Cache<Object, Object> nativeCache = caffeineCache.getNativeCache();
                
                com.github.benmanes.caffeine.cache.stats.CacheStats stats = nativeCache.stats();
                log.info("缓存统计 - {}: 命中率={}, 加载次数={}, 驱逐次数={}", 
                        cacheName, 
                        stats.hitRate(), 
                        stats.loadCount(), 
                        stats.evictionCount());
            }
        });
    }
}
\`\`\`

### 2. 缓存容量监控

\`\`\`java
@Component
public class RedisMonitor {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Scheduled(fixedRate = 300000) // 每5分钟检查一次
    public void monitorRedisMemory() {
        RedisConnection connection = redisTemplate.getConnectionFactory().getConnection();
        
        Properties info = connection.info("memory");
        String usedMemory = info.getProperty("used_memory_human");
        String maxMemory = info.getProperty("maxmemory_human");
        
        log.info("Redis内存使用情况: 已使用={}, 最大内存={}", usedMemory, maxMemory);
        
        // 如果内存使用率超过80%，发送告警
        long usedMemoryBytes = Long.parseLong(info.getProperty("used_memory"));
        long maxMemoryBytes = Long.parseLong(info.getProperty("maxmemory"));
        
        if (maxMemoryBytes > 0 && (double) usedMemoryBytes / maxMemoryBytes > 0.8) {
            log.warn("Redis内存使用率过高: {}%", 
                    String.format("%.2f", (double) usedMemoryBytes / maxMemoryBytes * 100));
        }
    }
}
\`\`\`

## 遇到的问题和解决方案

### 1. 缓存穿透

**问题**：恶意请求查询不存在的商品ID，导致大量请求直接访问数据库。

**解决方案**：
- 对空值进行缓存，设置较短的过期时间
- 使用布隆过滤器预判断数据是否存在

\`\`\`java
@Service
public class ProductCacheService {
    
    @Autowired
    private BloomFilter<Long> productBloomFilter;
    
    public Product getProduct(Long productId) {
        // 使用布隆过滤器预判断
        if (!productBloomFilter.mightContain(productId)) {
            return null;
        }
        
        // 继续缓存查询逻辑
        return getProductFromCache(productId);
    }
}
\`\`\`

### 2. 缓存雪崩

**问题**：大量缓存同时过期，导致请求直接访问数据库。

**解决方案**：
- 设置随机过期时间
- 使用互斥锁防止缓存击穿

\`\`\`java
@Service
public class ProductCacheService {
    
    private final Map<Long, ReentrantLock> locks = new ConcurrentHashMap<>();
    
    public Product getProduct(Long productId) {
        Product product = getFromCache(productId);
        if (product != null) {
            return product;
        }
        
        // 获取锁
        ReentrantLock lock = locks.computeIfAbsent(productId, k -> new ReentrantLock());
        lock.lock();
        
        try {
            // 双重检查
            product = getFromCache(productId);
            if (product != null) {
                return product;
            }
            
            // 从数据库加载
            product = productService.getProductById(productId);
            if (product != null) {
                setToCache(productId, product);
            }
            
            return product;
        } finally {
            lock.unlock();
        }
    }
}
\`\`\`

## 总结

通过多级缓存架构的优化，线上便利店项目的性能得到了显著提升：

- **响应时间**：商品详情页加载时间从平均2秒降低到200ms以内
- **并发能力**：系统能够支持更高的并发访问
- **用户体验**：页面加载速度明显提升，用户满意度提高

缓存架构的设计需要根据具体业务场景进行调整，同时要注意缓存一致性、缓存穿透、缓存雪崩等问题。在实际项目中，需要建立完善的监控体系，及时发现和解决问题。
    `
  },
  {
    id: "3",
    title: "基于ThreadLocal的线程隔离上下文设计",
    summary: "在匠码社区项目中，我使用ThreadLocal实现了线程隔离的用户上下文，减少了数据库查询次数，提升了系统性能。本文分享实现思路和注意事项。",
    date: "2025-04-05",
    readTime: "10分钟",
    tags: ["ThreadLocal", "线程隔离", "用户上下文", "Java", "性能优化"],
    category: "后端开发",
    views: 980,
    likes: 87,
    featured: true,
    slug: "threadlocal-user-context",
    content: `
# 基于ThreadLocal的线程隔离上下文设计

在匠码社区项目中，我使用ThreadLocal实现了线程隔离的用户上下文，有效减少了数据库查询次数，提升了系统性能。本文分享实现思路、代码实现和注意事项。

## 项目背景

在Web应用中，用户信息（如用户ID、用户名、权限等）经常需要在多个服务层之间传递。传统的做法是通过方法参数传递，或者每次都从数据库查询，这会导致代码冗余和性能问题。

## 设计思路

### 1. 用户上下文结构

\`\`\`java
public class UserContext {
    private Long userId;
    private String username;
    private String email;
    private List<String> roles;
    private Map<String, Object> attributes;
    
    // 构造函数、getter、setter方法
    // ...
}
\`\`\`

### 2. ThreadLocal容器

\`\`\`java
public class UserContextHolder {
    private static final ThreadLocal<UserContext> contextHolder = new ThreadLocal<>();
    
    public static void setContext(UserContext context) {
        contextHolder.set(context);
    }
    
    public static UserContext getContext() {
        return contextHolder.get();
    }
    
    public static void clearContext() {
        contextHolder.remove();
    }
    
    public static Long getCurrentUserId() {
        UserContext context = getContext();
        return context != null ? context.getUserId() : null;
    }
    
    public static String getCurrentUsername() {
        UserContext context = getContext();
        return context != null ? context.getUsername() : null;
    }
}
\`\`\`

## 实现方案

### 1. 拦截器实现

\`\`\`java
@Component
public class UserContextInterceptor implements HandlerInterceptor {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtTokenUtil jwtTokenUtil;
    
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, 
                           Object handler) throws Exception {
        // 从请求头获取token
        String token = getTokenFromRequest(request);
        
        if (StringUtils.hasText(token)) {
            try {
                // 解析token获取用户ID
                Long userId = jwtTokenUtil.getUserIdFromToken(token);
                
                if (userId != null) {
                    // 从数据库或缓存获取用户信息
                    UserContext userContext = getUserContext(userId);
                    
                    // 设置到ThreadLocal
                    UserContextHolder.setContext(userContext);
                }
            } catch (Exception e) {
                log.warn("解析用户token失败: {}", e.getMessage());
            }
        }
        
        return true;
    }
    
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                              Object handler, Exception ex) throws Exception {
        // 清理ThreadLocal，防止内存泄漏
        UserContextHolder.clearContext();
    }
    
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
    
    private UserContext getUserContext(Long userId) {
        // 先从缓存获取
        UserContext context = getUserContextFromCache(userId);
        if (context != null) {
            return context;
        }
        
        // 缓存没有，从数据库获取
        User user = userService.getUserById(userId);
        if (user != null) {
            context = buildUserContext(user);
            // 缓存用户上下文
            setUserContextToCache(userId, context);
            return context;
        }
        
        return null;
    }
    
    private UserContext buildUserContext(User user) {
        UserContext context = new UserContext();
        context.setUserId(user.getId());
        context.setUsername(user.getUsername());
        context.setEmail(user.getEmail());
        context.setRoles(user.getRoles());
        return context;
    }
}
\`\`\`

### 2. 配置拦截器

\`\`\`java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    
    @Autowired
    private UserContextInterceptor userContextInterceptor;
    
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(userContextInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns("/api/auth/**", "/api/public/**");
    }
}
\`\`\`

### 3. 服务层使用

\`\`\`java
@Service
public class ArticleService {
    
    public void createArticle(Article article) {
        // 直接从ThreadLocal获取用户信息
        Long userId = UserContextHolder.getCurrentUserId();
        String username = UserContextHolder.getCurrentUsername();
        
        if (userId == null) {
            throw new UnauthorizedException("用户未登录");
        }
        
        // 设置文章作者信息
        article.setAuthorId(userId);
        article.setAuthorName(username);
        article.setCreateTime(new Date());
        
        // 保存文章
        articleMapper.insert(article);
    }
    
    public void likeArticle(Long articleId) {
        Long userId = UserContextHolder.getCurrentUserId();
        
        if (userId == null) {
            throw new UnauthorizedException("用户未登录");
        }
        
        // 检查是否已点赞
        if (likeService.hasLiked(userId, articleId)) {
            throw new BusinessException("已经点赞过了");
        }
        
        // 创建点赞记录
        Like like = new Like();
        like.setUserId(userId);
        like.setArticleId(articleId);
        like.setCreateTime(new Date());
        
        likeService.createLike(like);
    }
}
\`\`\`

## 缓存优化

### 1. Redis缓存用户上下文

\`\`\`java
@Service
public class UserContextCacheService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    private static final String USER_CONTEXT_KEY_PREFIX = "user:context:";
    private static final Duration CACHE_DURATION = Duration.ofHours(2);
    
    public UserContext getUserContextFromCache(Long userId) {
        String key = USER_CONTEXT_KEY_PREFIX + userId;
        return (UserContext) redisTemplate.opsForValue().get(key);
    }
    
    public void setUserContextToCache(Long userId, UserContext context) {
        String key = USER_CONTEXT_KEY_PREFIX + userId;
        redisTemplate.opsForValue().set(key, context, CACHE_DURATION);
    }
    
    public void evictUserContext(Long userId) {
        String key = USER_CONTEXT_KEY_PREFIX + userId;
        redisTemplate.delete(key);
    }
}
\`\`\`

### 2. 用户信息更新时清除缓存

\`\`\`java
@Service
public class UserService {
    
    @Autowired
    private UserContextCacheService contextCacheService;
    
    @Transactional
    public void updateUser(User user) {
        // 更新用户信息
        userMapper.updateById(user);
        
        // 清除用户上下文缓存
        contextCacheService.evictUserContext(user.getId());
        
        // 发送消息通知其他服务清除缓存
        messageService.sendUserUpdateMessage(user.getId());
    }
}
\`\`\`

## 异步任务处理

### 1. 异步任务中的用户上下文传递

\`\`\`java
@Component
public class AsyncTaskService {
    
    @Async
    public void processUserAction(Long userId, String action) {
        // 异步任务中重新设置用户上下文
        UserContext userContext = getUserContext(userId);
        UserContextHolder.setContext(userContext);
        
        try {
            // 执行业务逻辑
            processAction(action);
        } finally {
            // 清理ThreadLocal
            UserContextHolder.clearContext();
        }
    }
    
    private void processAction(String action) {
        // 可以直接使用UserContextHolder获取用户信息
        Long userId = UserContextHolder.getCurrentUserId();
        String username = UserContextHolder.getCurrentUsername();
        
        log.info("用户 {} ({}) 执行操作: {}", username, userId, action);
    }
}
\`\`\`

### 2. 线程池配置

\`\`\`java
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {
    
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(500);
        executor.setThreadNamePrefix("AsyncTask-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
    
    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return new SimpleAsyncUncaughtExceptionHandler();
    }
}
\`\`\`

## 监控和调试

### 1. 用户上下文监控

\`\`\`java
@Aspect
@Component
public class UserContextMonitor {
    
    @Around("@annotation(org.springframework.web.bind.annotation.RequestMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.GetMapping) || " +
            "@annotation(org.springframework.web.bind.annotation.PostMapping)")
    public Object monitorUserContext(ProceedingJoinPoint joinPoint) throws Throwable {
        UserContext context = UserContextHolder.getContext();
        
        if (context != null) {
            log.debug("请求处理 - 用户: {} (ID: {})", 
                     context.getUsername(), context.getUserId());
        } else {
            log.debug("请求处理 - 匿名用户");
        }
        
        return joinPoint.proceed();
    }
}
\`\`\`

### 2. ThreadLocal泄漏检测

\`\`\`java
@Component
public class ThreadLocalLeakDetector {
    
    @Scheduled(fixedRate = 300000) // 每5分钟检查一次
    public void detectLeak() {
        // 获取当前活跃线程数
        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();
        int threadCount = threadBean.getThreadCount();
        
        log.info("当前活跃线程数: {}", threadCount);
        
        // 如果线程数异常增长，可能存在ThreadLocal泄漏
        if (threadCount > 1000) {
            log.warn("检测到可能的ThreadLocal泄漏，当前线程数: {}", threadCount);
        }
    }
}
\`\`\`

## 注意事项

### 1. 内存泄漏问题

ThreadLocal使用不当可能导致内存泄漏：

- **问题**：线程池中的线程长期存在，ThreadLocal中的对象无法被GC回收
- **解决方案**：在请求结束时及时清理ThreadLocal

### 2. 线程安全问题

ThreadLocal本身是线程安全的，但需要注意：

- 不要在多个线程间共享ThreadLocal中的对象
- 避免在异步任务中直接使用ThreadLocal

### 3. 性能考虑

- 合理设置缓存过期时间
- 避免在ThreadLocal中存储过大的对象
- 定期清理无用的缓存数据

## 总结

通过ThreadLocal实现线程隔离的用户上下文，匠码社区项目获得了以下收益：

- **性能提升**：减少了数据库查询次数，响应时间降低约30%
- **代码简化**：消除了大量的用户信息传递参数
- **维护性提升**：用户信息管理更加集中和统一

ThreadLocal是一个强大的工具，但需要谨慎使用，注意内存泄漏和线程安全问题。在实际项目中，建议结合缓存机制，并建立完善的监控体系。
    `
  },
  {
    id: "4",
    title: "基于雪花算法的分布式ID生成方案设计与实现",
    summary: "在线上便利店项目中，我设计并实现了一套基于雪花算法的分布式ID生成方案，解决了分布式环境下的ID唯一性和可追溯性问题。本文分享设计思路和实现细节。",
    date: "2025-06-28",
    readTime: "8分钟",
    tags: ["雪花算法", "分布式ID", "Java", "高并发", "系统设计"],
    category: "后端开发",
    views: 856,
    likes: 72,
    featured: false,
    slug: "snowflake-distributed-id-generation",
    content: `
# 基于雪花算法的分布式ID生成方案设计与实现

在线上便利店项目中，我设计并实现了一套基于雪花算法的分布式ID生成方案，有效解决了分布式环境下的ID唯一性和可追溯性问题。本文分享设计思路、实现细节和实际应用经验。

## 项目背景

在分布式系统中，传统的自增ID存在以下问题：
- 不同服务间的ID可能重复
- 无法保证全局唯一性
- 缺乏时间信息，难以追溯
- 容易被恶意用户猜测

因此需要设计一套分布式ID生成方案。

## 雪花算法原理

雪花算法（Snowflake）是Twitter开源的分布式ID生成算法，其结构如下：

\`\`\`
64位ID = 1位符号位 + 41位时间戳 + 10位工作机器ID + 12位序列号
\`\`\`

- **符号位**：固定为0，表示正数
- **时间戳**：毫秒级时间戳，可用69年
- **工作机器ID**：5位数据中心ID + 5位机器ID
- **序列号**：同一毫秒内的自增序列

## 技术实现

### 1. 雪花算法核心类

\`\`\`java
@Component
public class SnowflakeIdGenerator {
    
    // 开始时间戳 (2023-01-01 00:00:00)
    private final long startTimestamp = 1672531200000L;
    
    // 机器ID位数
    private final long machineIdBits = 5L;
    // 数据中心ID位数
    private final long dataCenterIdBits = 5L;
    // 序列号位数
    private final long sequenceBits = 12L;
    
    // 支持的最大机器ID
    private final long maxMachineId = -1L ^ (-1L << machineIdBits);
    // 支持的最大数据中心ID
    private final long maxDataCenterId = -1L ^ (-1L << dataCenterIdBits);
    // 序列号掩码
    private final long sequenceMask = -1L ^ (-1L << sequenceBits);
    
    // 机器ID左移位数
    private final long machineIdShift = sequenceBits;
    // 数据中心ID左移位数
    private final long dataCenterIdShift = sequenceBits + machineIdBits;
    // 时间戳左移位数
    private final long timestampLeftShift = sequenceBits + machineIdBits + dataCenterIdBits;
    
    private long machineId;
    private long dataCenterId;
    private long sequence = 0L;
    private long lastTimestamp = -1L;
    
    public SnowflakeIdGenerator(@Value("\${snowflake.machine-id:1}") long machineId,
                               @Value("\${snowflake.data-center-id:1}") long dataCenterId) {
        if (machineId > maxMachineId || machineId < 0) {
            throw new IllegalArgumentException("机器ID超出范围");
        }
        if (dataCenterId > maxDataCenterId || dataCenterId < 0) {
            throw new IllegalArgumentException("数据中心ID超出范围");
        }
        
        this.machineId = machineId;
        this.dataCenterId = dataCenterId;
    }
    
    @Synchronized
    public long nextId() {
        long timestamp = System.currentTimeMillis();
        
        // 时钟回拨检查
        if (timestamp < lastTimestamp) {
            throw new RuntimeException("时钟回拨，拒绝生成ID");
        }
        
        // 同一毫秒内序列号递增
        if (timestamp == lastTimestamp) {
            sequence = (sequence + 1) & sequenceMask;
            // 同一毫秒内序列号用尽
            if (sequence == 0) {
                timestamp = tilNextMillis(lastTimestamp);
            }
        } else {
            sequence = 0L;
        }
        
        lastTimestamp = timestamp;
        
        // 生成ID
        return ((timestamp - startTimestamp) << timestampLeftShift) |
               (dataCenterId << dataCenterIdShift) |
               (machineId << machineIdShift) |
               sequence;
    }
    
    private long tilNextMillis(long lastTimestamp) {
        long timestamp = System.currentTimeMillis();
        while (timestamp <= lastTimestamp) {
            timestamp = System.currentTimeMillis();
        }
        return timestamp;
    }
}
\`\`\`

### 2. 配置管理

\`\`\`yaml
# application.yml
snowflake:
  machine-id: 1
  data-center-id: 1
\`\`\`

### 3. 服务封装

\`\`\`java
@Service
public class IdGenerationService {
    
    @Autowired
    private SnowflakeIdGenerator idGenerator;
    
    public Long generateId() {
        return idGenerator.nextId();
    }
    
    public List<Long> generateBatchIds(int count) {
        List<Long> ids = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            ids.add(idGenerator.nextId());
        }
        return ids;
    }
    
    // 解析ID信息
    public IdInfo parseId(long id) {
        long timestamp = (id >> 22) + 1672531200000L;
        long dataCenterId = (id >> 17) & 0x1F;
        long machineId = (id >> 12) & 0x1F;
        long sequence = id & 0xFFF;
        
        return new IdInfo(timestamp, dataCenterId, machineId, sequence);
    }
}
\`\`\`

## 性能优化

### 1. 批量生成

\`\`\`java
@Component
public class BatchIdGenerator {
    
    private final BlockingQueue<Long> idQueue = new LinkedBlockingQueue<>(10000);
    private final SnowflakeIdGenerator idGenerator;
    
    public BatchIdGenerator(SnowflakeIdGenerator idGenerator) {
        this.idGenerator = idGenerator;
        startIdGenerator();
    }
    
    private void startIdGenerator() {
        Thread generator = new Thread(() -> {
            while (true) {
                try {
                    if (idQueue.size() < 1000) {
                        for (int i = 0; i < 100; i++) {
                            idQueue.put(idGenerator.nextId());
                        }
                    }
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        });
        generator.setDaemon(true);
        generator.start();
    }
    
    public Long getId() throws InterruptedException {
        return idQueue.take();
    }
}
\`\`\`

### 2. 缓存优化

\`\`\`java
@Service
public class CachedIdService {
    
    @Autowired
    private IdGenerationService idService;
    
    @Cacheable(value = "idCache", key = "#count")
    public List<Long> getBatchIds(int count) {
        return idService.generateBatchIds(count);
    }
}
\`\`\`

## 监控和运维

### 1. 性能监控

\`\`\`java
@Component
public class IdGenerationMonitor {
    
    private final AtomicLong totalGenerated = new AtomicLong(0);
    private final AtomicLong errorCount = new AtomicLong(0);
    
    @EventListener
    public void handleIdGenerated(IdGeneratedEvent event) {
        totalGenerated.incrementAndGet();
    }
    
    @EventListener
    public void handleIdGenerationError(IdGenerationErrorEvent event) {
        errorCount.incrementAndGet();
        log.error("ID生成错误: {}", event.getError());
    }
    
    @Scheduled(fixedRate = 60000)
    public void reportMetrics() {
        log.info("ID生成统计 - 总数: {}, 错误: {}", 
                totalGenerated.get(), errorCount.get());
    }
}
\`\`\`

### 2. 时钟回拨处理

\`\`\`java
@Component
public class ClockBackwardHandler {
    
    private final AtomicLong backwardCount = new AtomicLong(0);
    
    public void handleClockBackward(long currentTime, long lastTime) {
        long backward = lastTime - currentTime;
        backwardCount.incrementAndGet();
        
        log.warn("检测到时钟回拨: {}ms, 累计次数: {}", 
                backward, backwardCount.get());
        
        // 如果回拨时间较短，等待时间恢复
        if (backward < 1000) {
            try {
                Thread.sleep(backward + 1);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        } else {
            // 回拨时间较长，抛出异常
            throw new RuntimeException("时钟回拨时间过长: " + backward + "ms");
        }
    }
}
\`\`\`

## 实际应用

### 1. 订单ID生成

\`\`\`java
@Service
public class OrderService {
    
    @Autowired
    private IdGenerationService idService;
    
    @Transactional
    public Order createOrder(OrderRequest request) {
        Order order = new Order();
        order.setId(idService.generateId());
        order.setOrderNo("ORD" + order.getId());
        // ... 其他业务逻辑
        return orderMapper.insert(order);
    }
}
\`\`\`

### 2. 商品ID生成

\`\`\`java
@Service
public class ProductService {
    
    @Autowired
    private IdGenerationService idService;
    
    public Product createProduct(ProductRequest request) {
        Product product = new Product();
        product.setId(idService.generateId());
        product.setProductCode("P" + product.getId());
        // ... 其他业务逻辑
        return productMapper.insert(product);
    }
}
\`\`\`

## 总结

通过雪花算法实现的分布式ID生成方案，线上便利店项目获得了以下收益：

- **全局唯一性**：确保分布式环境下的ID唯一性
- **高性能**：单机每秒可生成数百万个ID
- **可追溯性**：ID包含时间信息，便于数据分析和问题排查
- **高可用性**：支持时钟回拨检测和异常处理

雪花算法是一个成熟可靠的分布式ID生成方案，在实际项目中表现良好，是分布式系统ID生成的首选方案。
    `
  },
  {
    id: "5",
    title: "基于EasyExcel的异步文件导出优化实践",
    summary: "在线上便利店项目中，我使用EasyExcel实现了异步文件导出功能，解决了大文件导出时的内存溢出和长时间等待问题。本文分享实现思路和性能优化方案。",
    date: "2025-07-25",
    readTime: "10分钟",
    tags: ["EasyExcel", "异步处理", "文件导出", "性能优化", "Java"],
    category: "后端开发",
    views: 723,
    likes: 65,
    featured: false,
    slug: "easyexcel-async-export-optimization",
    content: `
# 基于EasyExcel的异步文件导出优化实践

在线上便利店项目中，我使用EasyExcel实现了异步文件导出功能，有效解决了大文件导出时的内存溢出和长时间等待问题。本文分享实现思路、技术方案和性能优化经验。

## 项目背景

在线上便利店项目中，商家需要导出运营数据报表，包括订单数据、商品销售统计、用户行为分析等。传统的同步导出方式存在以下问题：

- **内存溢出**：大文件导出时容易导致JVM内存不足
- **响应超时**：导出时间过长，用户等待体验差
- **系统阻塞**：导出过程占用大量资源，影响其他功能

## 技术选型

选择EasyExcel的原因：
- **内存友好**：基于SAX模式，支持大文件读写
- **功能丰富**：支持多种格式和复杂表头
- **性能优秀**：相比Apache POI性能提升数倍
- **社区活跃**：阿里巴巴开源，文档完善

## 实现方案

### 1. 异步导出服务

\`\`\`java
@Service
public class AsyncExportService {
    
    @Autowired
    private ThreadPoolTaskExecutor exportExecutor;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private OSSService ossService;
    
    public String startExport(ExportRequest request) {
        // 生成导出任务ID
        String taskId = UUID.randomUUID().toString();
        
        // 异步执行导出任务
        exportExecutor.submit(() -> {
            try {
                executeExport(taskId, request);
            } catch (Exception e) {
                log.error("导出任务执行失败: {}", taskId, e);
                updateTaskStatus(taskId, ExportStatus.FAILED, e.getMessage());
            }
        });
        
        return taskId;
    }
    
    private void executeExport(String taskId, ExportRequest request) {
        try {
            // 更新任务状态为处理中
            updateTaskStatus(taskId, ExportStatus.PROCESSING, "开始导出");
            
            // 生成文件路径
            String fileName = generateFileName(request);
            String filePath = "/tmp/" + fileName;
            
            // 执行导出
            exportToFile(request, filePath);
            
            // 上传到OSS
            String ossUrl = uploadToOSS(filePath, fileName);
            
            // 发送邮件通知
            sendNotificationEmail(request.getUserEmail(), ossUrl, fileName);
            
            // 更新任务状态为完成
            updateTaskStatus(taskId, ExportStatus.COMPLETED, ossUrl);
            
        } catch (Exception e) {
            log.error("导出执行失败: {}", taskId, e);
            updateTaskStatus(taskId, ExportStatus.FAILED, e.getMessage());
        }
    }
}
\`\`\`

### 2. EasyExcel导出实现

\`\`\`java
@Component
public class ExcelExportService {
    
    public void exportOrderData(ExportRequest request, String filePath) {
        // 创建写入器
        ExcelWriter excelWriter = EasyExcel.write(filePath, OrderExportData.class)
                .registerWriteHandler(new CustomCellWriteHandler())
                .build();
        
        try {
            // 分批查询数据
            int pageSize = 1000;
            int pageNum = 1;
            
            while (true) {
                List<OrderExportData> dataList = queryOrderData(request, pageNum, pageSize);
                
                if (dataList.isEmpty()) {
                    break;
                }
                
                // 写入数据
                WriteSheet writeSheet = EasyExcel.writerSheet("订单数据").build();
                excelWriter.write(dataList, writeSheet);
                
                pageNum++;
                
                // 避免内存溢出，及时清理
                dataList.clear();
            }
            
        } finally {
            excelWriter.finish();
        }
    }
    
    private List<OrderExportData> queryOrderData(ExportRequest request, int pageNum, int pageSize) {
        // 分页查询订单数据
        PageHelper.startPage(pageNum, pageSize);
        return orderMapper.selectForExport(request.getStartDate(), request.getEndDate());
    }
}
\`\`\`

### 3. 自定义单元格处理器

\`\`\`java
@Component
public class CustomCellWriteHandler implements CellWriteHandler {
    
    @Override
    public void afterCellDispose(WriteSheetHolder writeSheetHolder, WriteTableHolder writeTableHolder,
                                List<CellData> cellDataList, Cell cell, Head head, Integer relativeRowIndex, Boolean isHead) {
        
        // 设置表头样式
        if (isHead) {
            CellStyle headStyle = createHeadStyle(writeSheetHolder.getSheet().getWorkbook());
            cell.setCellStyle(headStyle);
        } else {
            // 设置数据行样式
            CellStyle dataStyle = createDataStyle(writeSheetHolder.getSheet().getWorkbook());
            cell.setCellStyle(dataStyle);
        }
        
        // 设置列宽
        if (relativeRowIndex == 0) {
            int columnIndex = cell.getColumnIndex();
            writeSheetHolder.getSheet().setColumnWidth(columnIndex, getColumnWidth(columnIndex));
        }
    }
    
    private CellStyle createHeadStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        font.setColor(IndexedColors.WHITE.getIndex());
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }
    
    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }
    
    private int getColumnWidth(int columnIndex) {
        // 根据列内容设置合适的宽度
        switch (columnIndex) {
            case 0: return 20; // 订单号
            case 1: return 15; // 用户ID
            case 2: return 20; // 商品名称
            case 3: return 15; // 数量
            case 4: return 15; // 金额
            case 5: return 20; // 创建时间
            default: return 15;
        }
    }
}
\`\`\`

### 4. 线程池配置

\`\`\`java
@Configuration
public class ExportConfig {
    
    @Bean("exportExecutor")
    public ThreadPoolTaskExecutor exportExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);
        executor.setMaxPoolSize(5);
        executor.setQueueCapacity(10);
        executor.setThreadNamePrefix("Export-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.setKeepAliveSeconds(60);
        executor.initialize();
        return executor;
    }
}
\`\`\`

## 性能优化

### 1. 分批处理

\`\`\`java
@Service
public class BatchExportService {
    
    public void exportLargeDataset(ExportRequest request, String filePath) {
        // 计算总数据量
        long totalCount = countTotalData(request);
        int batchSize = 1000;
        int totalBatches = (int) Math.ceil((double) totalCount / batchSize);
        
        ExcelWriter excelWriter = EasyExcel.write(filePath, ExportData.class).build();
        
        try {
            for (int batchNum = 1; batchNum <= totalBatches; batchNum++) {
                // 分批查询数据
                List<ExportData> batchData = queryBatchData(request, batchNum, batchSize);
                
                // 写入数据
                WriteSheet writeSheet = EasyExcel.writerSheet("数据").build();
                excelWriter.write(batchData, writeSheet);
                
                // 更新进度
                updateProgress(request.getTaskId(), batchNum, totalBatches);
                
                // 清理内存
                batchData.clear();
            }
        } finally {
            excelWriter.finish();
        }
    }
}
\`\`\`

### 2. 内存优化

\`\`\`java
@Component
public class MemoryOptimizedExportService {
    
    public void exportWithMemoryOptimization(ExportRequest request, String filePath) {
        // 使用流式写入
        EasyExcel.write(filePath, ExportData.class)
                .registerWriteHandler(new MemoryOptimizedWriteHandler())
                .sheet("数据")
                .doWrite(() -> {
                    // 流式查询数据
                    return queryDataStream(request);
                });
    }
    
    private Stream<ExportData> queryDataStream(ExportRequest request) {
        return orderMapper.selectStreamForExport(request.getStartDate(), request.getEndDate());
    }
}
\`\`\`

## 监控和运维

### 1. 任务状态监控

\`\`\`java
@Component
public class ExportTaskMonitor {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    public void updateTaskStatus(String taskId, ExportStatus status, String message) {
        ExportTaskInfo taskInfo = new ExportTaskInfo();
        taskInfo.setTaskId(taskId);
        taskInfo.setStatus(status);
        taskInfo.setMessage(message);
        taskInfo.setUpdateTime(new Date());
        
        String key = "export:task:" + taskId;
        redisTemplate.opsForValue().set(key, taskInfo, Duration.ofHours(24));
    }
    
    public ExportTaskInfo getTaskStatus(String taskId) {
        String key = "export:task:" + taskId;
        return (ExportTaskInfo) redisTemplate.opsForValue().get(key);
    }
}
\`\`\`

### 2. 性能监控

\`\`\`java
@Aspect
@Component
public class ExportPerformanceMonitor {
    
    @Around("@annotation(org.springframework.scheduling.annotation.Async)")
    public Object monitorExportPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().getName();
        
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            
            log.info("导出任务执行完成 - 方法: {}, 耗时: {}ms", methodName, duration);
            
            // 记录性能指标
            recordPerformanceMetrics(methodName, duration, true);
            
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("导出任务执行失败 - 方法: {}, 耗时: {}ms", methodName, duration, e);
            
            // 记录错误指标
            recordPerformanceMetrics(methodName, duration, false);
            
            throw e;
        }
    }
}
\`\`\`

## 实际应用效果

### 1. 性能提升

- **内存使用**：从原来的2GB降低到200MB以内
- **响应时间**：从同步等待改为异步通知，用户体验大幅提升
- **并发能力**：支持多个用户同时导出，互不影响

### 2. 用户体验

- **即时反馈**：用户提交导出请求后立即返回任务ID
- **进度跟踪**：用户可以通过任务ID查询导出进度
- **邮件通知**：导出完成后自动发送邮件通知用户下载

## 总结

通过EasyExcel实现的异步文件导出方案，线上便利店项目获得了以下收益：

- **性能优化**：解决了大文件导出的内存溢出问题
- **用户体验**：异步处理避免了长时间等待
- **系统稳定性**：导出任务不影响其他功能正常运行
- **可扩展性**：支持多种数据格式和自定义样式

EasyExcel是一个优秀的Excel处理库，结合异步处理模式，能够很好地解决企业级应用中的文件导出需求。
    `
  },
  {
    id: "6",
    title: "Redis ZSet在用户活跃度排行中的应用实践",
    summary: "在匠码社区项目中，我使用Redis ZSet实现了用户活跃度排行功能，并通过先写MySQL再删除Redis的方案保证了高并发场景下的缓存一致性。本文分享实现思路和优化方案。",
    date: "2025-05-20",
    readTime: "11分钟",
    tags: ["Redis", "ZSet", "排行榜", "缓存一致性", "高并发"],
    category: "后端开发",
    views: 892,
    likes: 78,
    featured: true,
    slug: "redis-zset-user-ranking-system",
    content: `
# Redis ZSet在用户活跃度排行中的应用实践

在匠码社区项目中，我使用Redis ZSet实现了用户活跃度排行功能，并通过先写MySQL再删除Redis的方案保证了高并发场景下的缓存一致性。本文分享实现思路、技术方案和性能优化经验。

## 项目背景

匠码社区需要展示用户活跃度排行榜，包括：
- 日活跃度排行
- 周活跃度排行  
- 月活跃度排行
- 总活跃度排行

传统的关系型数据库方案在高并发场景下性能较差，需要引入Redis ZSet来优化。

## 技术选型

选择Redis ZSet的原因：
- **有序性**：天然支持排序，无需额外计算
- **高性能**：O(log N)的查询复杂度
- **原子性**：支持原子操作，保证数据一致性
- **灵活性**：支持多种排序规则和范围查询

## 实现方案

### 1. 用户活跃度计算

\`\`\`java
@Service
public class UserActivityService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    private static final String DAILY_RANKING_KEY = "user:activity:daily";
    private static final String WEEKLY_RANKING_KEY = "user:activity:weekly";
    private static final String MONTHLY_RANKING_KEY = "user:activity:monthly";
    private static final String TOTAL_RANKING_KEY = "user:activity:total";
    
    /**
     * 增加用户活跃度
     */
    public void increaseUserActivity(Long userId, int points) {
        // 计算活跃度分数
        double score = calculateActivityScore(points);
        
        // 更新各个时间维度的排行榜
        updateRanking(DAILY_RANKING_KEY, userId, score);
        updateRanking(WEEKLY_RANKING_KEY, userId, score);
        updateRanking(MONTHLY_RANKING_KEY, userId, score);
        updateRanking(TOTAL_RANKING_KEY, userId, score);
    }
    
    private double calculateActivityScore(int points) {
        // 根据当前时间计算分数，确保时间越新分数越高
        long timestamp = System.currentTimeMillis();
        return timestamp + points;
    }
    
    private void updateRanking(String key, Long userId, double score) {
        redisTemplate.opsForZSet().add(key, userId.toString(), score);
    }
}
\`\`\`

### 2. 排行榜查询

\`\`\`java
@Service
public class RankingService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private UserService userService;
    
    /**
     * 获取用户排行榜
     */
    public List<UserRankingInfo> getUserRanking(String rankingType, int start, int end) {
        String key = getRankingKey(rankingType);
        
        // 从Redis获取排行榜数据
        Set<ZSetOperations.TypedTuple<Object>> rankingData = 
            redisTemplate.opsForZSet().reverseRangeWithScores(key, start, end);
        
        if (rankingData == null || rankingData.isEmpty()) {
            return new ArrayList<>();
        }
        
        // 构建用户排行榜信息
        List<UserRankingInfo> rankingList = new ArrayList<>();
        int rank = start + 1;
        
        for (ZSetOperations.TypedTuple<Object> tuple : rankingData) {
            Long userId = Long.valueOf(tuple.getValue().toString());
            Double score = tuple.getScore();
            
            // 获取用户信息
            User user = userService.getUserById(userId);
            if (user != null) {
                UserRankingInfo rankingInfo = new UserRankingInfo();
                rankingInfo.setUserId(userId);
                rankingInfo.setUsername(user.getUsername());
                rankingInfo.setAvatar(user.getAvatar());
                rankingInfo.setRank(rank);
                rankingInfo.setScore(score);
                rankingInfo.setActivityPoints(extractActivityPoints(score));
                
                rankingList.add(rankingInfo);
                rank++;
            }
        }
        
        return rankingList;
    }
    
    /**
     * 获取用户排名
     */
    public Long getUserRank(String rankingType, Long userId) {
        String key = getRankingKey(rankingType);
        Long rank = redisTemplate.opsForZSet().reverseRank(key, userId.toString());
        return rank != null ? rank + 1 : null;
    }
    
    /**
     * 获取用户分数
     */
    public Double getUserScore(String rankingType, Long userId) {
        String key = getRankingKey(rankingType);
        return redisTemplate.opsForZSet().score(key, userId.toString());
    }
    
    private String getRankingKey(String rankingType) {
        switch (rankingType) {
            case "daily": return "user:activity:daily";
            case "weekly": return "user:activity:weekly";
            case "monthly": return "user:activity:monthly";
            case "total": return "user:activity:total";
            default: throw new IllegalArgumentException("不支持的排行榜类型");
        }
    }
    
    private int extractActivityPoints(Double score) {
        // 从分数中提取活跃度点数
        return (int) (score % 1000000);
    }
}
\`\`\`

### 3. 缓存一致性保证

\`\`\`java
@Service
public class CacheConsistencyService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Autowired
    private UserActivityMapper userActivityMapper;
    
    /**
     * 先写MySQL，再删除Redis缓存
     */
    @Transactional
    public void updateUserActivityWithConsistency(Long userId, int points) {
        // 1. 更新MySQL数据库
        UserActivity activity = new UserActivity();
        activity.setUserId(userId);
        activity.setPoints(points);
        activity.setCreateTime(new Date());
        userActivityMapper.insert(activity);
        
        // 2. 删除Redis缓存
        deleteUserActivityCache(userId);
        
        // 3. 发送消息通知其他服务清除缓存
        messageService.sendCacheEvictMessage(userId);
    }
    
    /**
     * 删除用户活跃度缓存
     */
    private void deleteUserActivityCache(Long userId) {
        String[] keys = {
            "user:activity:daily",
            "user:activity:weekly", 
            "user:activity:monthly",
            "user:activity:total"
        };
        
        for (String key : keys) {
            redisTemplate.opsForZSet().remove(key, userId.toString());
        }
    }
    
    /**
     * 缓存预热
     */
    @PostConstruct
    public void warmUpRankingCache() {
        // 从MySQL加载用户活跃度数据
        List<UserActivity> activities = userActivityMapper.selectAllActivities();
        
        // 按用户分组计算总分
        Map<Long, Integer> userTotalPoints = activities.stream()
            .collect(Collectors.groupingBy(
                UserActivity::getUserId,
                Collectors.summingInt(UserActivity::getPoints)
            ));
        
        // 更新Redis排行榜
        for (Map.Entry<Long, Integer> entry : userTotalPoints.entrySet()) {
            Long userId = entry.getKey();
            Integer points = entry.getValue();
            
            double score = calculateActivityScore(points);
            updateRanking("user:activity:total", userId, score);
        }
    }
}
\`\`\`

### 4. 定时任务维护

\`\`\`java
@Component
public class RankingMaintenanceService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 每日凌晨清理日排行榜
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanDailyRanking() {
        String key = "user:activity:daily";
        redisTemplate.delete(key);
        log.info("日排行榜清理完成");
    }
    
    /**
     * 每周一凌晨清理周排行榜
     */
    @Scheduled(cron = "0 0 0 ? * MON")
    public void cleanWeeklyRanking() {
        String key = "user:activity:weekly";
        redisTemplate.delete(key);
        log.info("周排行榜清理完成");
    }
    
    /**
     * 每月1号凌晨清理月排行榜
     */
    @Scheduled(cron = "0 0 0 1 * ?")
    public void cleanMonthlyRanking() {
        String key = "user:activity:monthly";
        redisTemplate.delete(key);
        log.info("月排行榜清理完成");
    }
    
    /**
     * 定期同步MySQL数据到Redis
     */
    @Scheduled(fixedRate = 300000) // 每5分钟执行一次
    public void syncRankingData() {
        try {
            // 从MySQL同步最新数据到Redis
            syncUserActivityData();
            log.info("排行榜数据同步完成");
        } catch (Exception e) {
            log.error("排行榜数据同步失败", e);
        }
    }
}
\`\`\`

## 性能优化

### 1. 批量操作

\`\`\`java
@Service
public class BatchRankingService {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    /**
     * 批量更新用户活跃度
     */
    public void batchUpdateUserActivity(Map<Long, Integer> userPoints) {
        // 使用管道批量操作
        redisTemplate.executePipelined((RedisCallback<Object>) connection -> {
            for (Map.Entry<Long, Integer> entry : userPoints.entrySet()) {
                Long userId = entry.getKey();
                Integer points = entry.getValue();
                double score = calculateActivityScore(points);
                
                // 批量更新各个排行榜
                String[] keys = {
                    "user:activity:daily",
                    "user:activity:weekly",
                    "user:activity:monthly", 
                    "user:activity:total"
                };
                
                for (String key : keys) {
                    connection.zAdd(key.getBytes(), score, userId.toString().getBytes());
                }
            }
            return null;
        });
    }
}
\`\`\`

### 2. 内存优化

\`\`\`java
@Component
public class RankingMemoryOptimizer {
    
    /**
     * 定期清理过期数据
     */
    @Scheduled(fixedRate = 3600000) // 每小时执行一次
    public void cleanExpiredData() {
        // 清理30天前的数据
        long thirtyDaysAgo = System.currentTimeMillis() - 30 * 24 * 60 * 60 * 1000L;
        
        String[] keys = {
            "user:activity:daily",
            "user:activity:weekly",
            "user:activity:monthly"
        };
        
        for (String key : keys) {
            // 删除30天前的数据
            redisTemplate.opsForZSet().removeRangeByScore(key, 0, thirtyDaysAgo);
        }
    }
    
    /**
     * 限制排行榜大小
     */
    public void limitRankingSize(String key, int maxSize) {
        // 只保留前N名的数据
        redisTemplate.opsForZSet().removeRange(key, 0, -(maxSize + 1));
    }
}
\`\`\`

## 监控和运维

### 1. 排行榜监控

\`\`\`java
@Component
public class RankingMonitor {
    
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    @Scheduled(fixedRate = 60000) // 每分钟检查一次
    public void monitorRankingHealth() {
        String[] keys = {
            "user:activity:daily",
            "user:activity:weekly",
            "user:activity:monthly",
            "user:activity:total"
        };
        
        for (String key : keys) {
            Long size = redisTemplate.opsForZSet().size(key);
            log.info("排行榜 {} 当前大小: {}", key, size);
            
            // 如果排行榜为空，触发数据同步
            if (size == 0) {
                log.warn("排行榜 {} 为空，触发数据同步", key);
                triggerDataSync(key);
            }
        }
    }
    
    private void triggerDataSync(String key) {
        // 触发数据同步逻辑
        rankingMaintenanceService.syncRankingData();
    }
}
\`\`\`

### 2. 性能监控

\`\`\`java
@Aspect
@Component
public class RankingPerformanceMonitor {
    
    @Around("execution(* com.example.service.RankingService.*(..))")
    public Object monitorRankingPerformance(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().getName();
        
        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            
            log.info("排行榜操作完成 - 方法: {}, 耗时: {}ms", methodName, duration);
            
            // 记录性能指标
            recordPerformanceMetrics(methodName, duration, true);
            
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            log.error("排行榜操作失败 - 方法: {}, 耗时: {}ms", methodName, duration, e);
            
            // 记录错误指标
            recordPerformanceMetrics(methodName, duration, false);
            
            throw e;
        }
    }
}
\`\`\`

## 实际应用效果

### 1. 性能提升

- **查询性能**：排行榜查询从原来的500ms降低到10ms以内
- **并发能力**：支持1000+并发用户同时查看排行榜
- **内存使用**：相比关系型数据库方案，内存使用降低80%

### 2. 用户体验

- **实时性**：用户活跃度变化立即反映在排行榜中
- **准确性**：通过缓存一致性方案保证数据准确性
- **稳定性**：系统运行稳定，无数据丢失

## 总结

通过Redis ZSet实现的用户活跃度排行系统，匠码社区项目获得了以下收益：

- **高性能**：O(log N)的查询复杂度，支持高并发访问
- **数据一致性**：先写MySQL再删除Redis的方案保证缓存一致性
- **可扩展性**：支持多种时间维度的排行榜
- **易维护**：定时任务自动维护数据，减少人工干预

Redis ZSet是构建排行榜系统的理想选择，结合合理的缓存一致性策略，能够很好地满足企业级应用的性能需求。
    `
  }
]

// 生成静态路径参数
export async function generateStaticParams() {
  // 包含所有可能的slug，包括旧的slug
  const allSlugs = [
    ...blogPosts.map((post) => post.slug),
    "springboot-configuration-hell", // 旧的slug
    "mysql-index-optimization-story",
    "redis-avalanche-rescue",
    "docker-learning-journey",
    "elasticsearch-learning-journey",
    "rabbitmq-async-processing",
    "nginx-reverse-proxy-guide",
    "git-version-control-journey",
    "maven-dependency-management",
    "jvm-tuning-practice",
    "spring-cloud-microservices",
    "design-patterns-in-practice",
    "mongodb-learning-curve",
    "restful-api-design-evolution",
    "distributed-lock-evolution",
    "spring-security-evolution",
    "thread-pool-optimization",
    "kubernetes-container-orchestration",
    "cicd-pipeline-evolution",
    "java-interview-guide",
    "snowflake-distributed-id-generation",
    "easyexcel-async-export-optimization",
    "redis-zset-user-ranking-system"
  ]
  
  return allSlugs.map((slug) => ({
    slug: slug,
  }))
}

// 根据slug查找博客文章
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts.find(post => post.slug === params.slug)
  
  if (!post) {
    return {
      title: '博客文章未找到',
      description: '抱歉，您访问的博客文章不存在。'
    }
  }
  
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(post => post.slug === params.slug)
  
  if (!post) {
    notFound()
  }
  
  return <BlogDetail post={post} />
} 