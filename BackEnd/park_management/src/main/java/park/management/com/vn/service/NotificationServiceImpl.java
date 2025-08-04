package park.management.com.vn.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import park.management.com.vn.entity.Notification;
import park.management.com.vn.mapper.NotificationMapper;
import park.management.com.vn.model.request.NotificationRequest;
import park.management.com.vn.model.response.NotificationResponse;
import park.management.com.vn.repository.NotificationRepository;
import park.management.com.vn.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repository;
    private final NotificationMapper mapper;
    private final UserRepository usersRepository;

    @Override
    public NotificationResponse createNotification(NotificationRequest request) {
        Notification entity = mapper.toEntity(request);
        entity.setUser(usersRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found")));
        return mapper.toResponse(repository.save(entity));
    }

    @Override
    public NotificationResponse getNotificationById(Long id) {
        Notification entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        return mapper.toResponse(entity);
    }

    @Override
    public List<NotificationResponse> getAllNotifications() {
        return repository.findAll().stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationResponse updateNotification(Long id, NotificationRequest request) {
        Notification existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        Notification updated = mapper.toEntity(request);
        updated.setId(id);
        updated.setCreatedAt(existing.getCreatedAt());
        updated.setCreatedBy(existing.getCreatedBy());
        return mapper.toResponse(repository.save(updated));
    }

    @Override
    public void deleteNotification(Long id) {
        repository.deleteById(id);
    }
}
