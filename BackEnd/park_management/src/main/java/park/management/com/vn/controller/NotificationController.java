package park.management.com.vn.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import park.management.com.vn.model.request.NotificationRequest;
import park.management.com.vn.model.response.NotificationResponse;
import park.management.com.vn.service.NotificationService;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService service;

    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(@RequestBody NotificationRequest request) {
        return ResponseEntity.ok(service.createNotification(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotificationResponse> getNotificationById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getNotificationById(id));
    }

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getAllNotification() {
        return ResponseEntity.ok(service.getAllNotifications());
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotificationResponse> updateNotification(@PathVariable Long id, @RequestBody NotificationRequest request) {
        return ResponseEntity.ok(service.updateNotification(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        service.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}